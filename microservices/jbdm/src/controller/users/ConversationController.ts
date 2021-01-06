import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Channel, ChannelType, Member, Role, Server, ServerType, User, UserRole } from "@discorde/datamodel";

export class ConversationController {
  private serverRepository = getRepository(Server);
  private userRepository = getRepository(User);
  private memberRepository = getRepository(Member);

  async add(req: Request, res: Response) {
    const { usersId } = req.body;
    if (!usersId) {
      res.status(403).send("Missing usersId parameter");
      return;
    }
    if (res.locals.user.role !== UserRole.ADMIN && !usersId.includes(res.locals.user.id)) {
      res.status(401).send("Cant create conversation without self");
    }

    const sortedIds = usersId.sort();

    const userMembers = await this.memberRepository.find({
      where: {
        user: {
          id: res.locals.user.id
        },
      },
      relations: ["server", "server.members", "server.members.user"]
    });

    const exist = userMembers.find((userMember) => {
      const ids = userMember.server.members.map((member) => member.user.id).sort();
      return ids.reduce((acc, e, i) => acc + (sortedIds[i] === e ? 1 : 0), 0) === ids.length;
    });

    if (exist)
      return exist;

    let mainChannel = new Channel();
    let server = new Server();
    let everyoneRole = new Role();

    server.name = sortedIds.reduce((acc, e) => acc + e, "");
    server.type = ServerType.CONVERSATION;
    await this.serverRepository.save(server);

    mainChannel.name = "Main";
    mainChannel.server = server;
    mainChannel.type = ChannelType.TEXTUAL;

    everyoneRole.name = "everyone";
    everyoneRole.isEveryone = true;
    everyoneRole.server = server;

    await getRepository(Channel).save(mainChannel)
    await getRepository(Role).save(everyoneRole);

    const names = [];
    const filteredUserId = sortedIds.filter((e, i) => sortedIds.findIndex((e2) => e2 === e) === i);
    for (let i in filteredUserId) {
      try {
        const member = new Member();
        const user = await this.userRepository.findOneOrFail(filteredUserId[i]);
        member.user = user;
        member.roles = [everyoneRole];
        member.server = server;
        names.push(user.username);
        await this.memberRepository.save(member);
      } catch (e) {}
    }
    server.name = names.join('-');
    return await this.serverRepository.save(server);
  }
}