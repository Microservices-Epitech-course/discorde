import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Channel, ChannelType, Member, publisher, Role, Server, ServerType, User, UserRole } from "@discorde/datamodel";

export class ConversationController {
  private serverRepository = getRepository(Server);
  private userRepository = getRepository(User);
  private memberRepository = getRepository(Member);

  async add(req: Request, res: Response) {
    try {
      const usersId: number[] = req.body.usersId;
      if (!usersId) {
        res.status(403).send("Missing usersId parameter");
        return;
      }
      if (res.locals.user.role !== UserRole.ADMIN && !usersId.includes(res.locals.user.id)) {
        res.status(401).send("Cant create conversation without self");
        return;
      }

      const sortedIds = usersId.filter((e, i) => usersId.findIndex((e2) => e2 === e) === i).sort();

      if (sortedIds.length < 2) {
        res.status(403).send("Too few users");
        return;
      }

      const userMembers = (await this.memberRepository.find({
        where: {
          user: {
            id: res.locals.user.id
          },
        },
        relations: ["server", "server.members", "server.members.user", "server.channels", "server.roles", "server.roles.members"]
      })).filter((e) => e.server.type === ServerType.CONVERSATION);

      const exist = userMembers.find((userMember) => {
        const ids = userMember.server.members.map((member) => member.user.id).sort();
        return ids.reduce((acc, e, i) => acc + (sortedIds[i] === e ? 1 : 0), 0) === sortedIds.length;
      });

      if (exist) {
        exist.quit = false;
        await getRepository(Member).save(exist);
        publisher.publish(`user:${res.locals.user.id}`, JSON.stringify({action: "conversationAdd", data: exist.server}));
        return exist.server;
      }

      let mainChannel = new Channel();
      let server = new Server();
      let everyoneRole = new Role();

      server.name = sortedIds.reduce((acc, e) => acc + e, "");
      server.type = ServerType.CONVERSATION;

      mainChannel.name = "Main";
      mainChannel.type = ChannelType.TEXTUAL;

      everyoneRole.name = "everyone";
      everyoneRole.isEveryone = true;

      await getRepository(Channel).save(mainChannel)
      await getRepository(Role).save(everyoneRole);

      server.channels = [mainChannel]
      server.roles = [everyoneRole];

      const names = [];
      const users = [];
      server.members = [];
      const filteredUserId = sortedIds.filter((e, i) => sortedIds.findIndex((e2) => e2 === e) === i);
      for (let i in filteredUserId) {
        try {
          const member = new Member();
          const user = await this.userRepository.findOneOrFail(filteredUserId[i]);
          member.user = user;
          member.roles = [everyoneRole];
          names.push(user.username);
          users.push(user.id);
          await this.memberRepository.save(member);
          server.members.push(member);
        } catch (e) {
          console.error(e);
        }
      }
      server.name = names.join('-');
      await this.serverRepository.save(server);
      const serverSend = await this.serverRepository.findOne(
        server.id, {
          relations: ["members", "members.user", "channels", "roles", "roles.members"]
        });
      return serverSend;
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  }
}