import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Channel, ChannelType, Member, Role, Server, ServerType, User } from "@discorde/datamodel";

export class ConversationController {
  private serverRepository = getRepository(Server);
  private userRepository = getRepository(User);
  private memberRepository = getRepository(Member);

  async add(req: Request, res: Response) {
    // TODO : Remove if same ids and check that creator is inside
    const { usersId } = req.body;
    if (!usersId) {
      res.status(404).send("Missing usersId parameter");
      return;
    }
    let mainChannel = new Channel();
    let server = new Server();
    let everyoneRole = new Role();

    server.name = usersId.reduce((acc, e) => acc + e, "");
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
    const filteredUserId = usersId.filter((e, i) => usersId.findIndex((e2) => e2 === e) === i);
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