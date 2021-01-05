import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Channel, ChannelType, Member, Role, Server, ServerType, User } from "@discorde/datamodel";

export class ConversationController {
  private serverRepository = getRepository(Server);
  private userRepository = getRepository(User);
  private memberRepository = getRepository(Member);

  async add(req: Request, res: Response) {
    const { usersId } = req.body;
    if (!usersId) {
      res.status(404).send("Missing usersId parameter");
      return;
    }
    let creatorMember = new Member();
    let mainChannel = new Channel();
    let server = new Server();
    let everyoneRole = new Role();

    server.name = usersId.reduce((acc, e) => acc + e, "");
    server.type = ServerType.CONVERSATION;
    await this.serverRepository.save(server);

    creatorMember.user = res.locals.user;
    creatorMember.roles = [everyoneRole];
    creatorMember.server = server;

    mainChannel.name = "Main";
    mainChannel.server = server;
    mainChannel.type = ChannelType.TEXTUAL;

    everyoneRole.name = "everyone";
    everyoneRole.isEveryone = true;
    everyoneRole.server = server;

    let name = res.locals.user.username;
    
    await getRepository(Channel).save(mainChannel)
    await getRepository(Role).save(everyoneRole);
    const filteredUserId = usersId.filter((e, i) => usersId.findIndex((e2) => e2 === e) === i);
    for (let i in filteredUserId) {
      try {
        const member = new Member();
        const user = await this.userRepository.findOneOrFail(filteredUserId[i]);
        member.user = user;
        member.roles = [everyoneRole];
        member.server = server;
        name += "-" + user.username; 
        await this.memberRepository.save(member);
      } catch (e) {}
    }
    server.name = name;
    await this.serverRepository.save(server);
    return await this.memberRepository.save(creatorMember);
  }
}