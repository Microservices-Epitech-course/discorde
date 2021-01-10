import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Invitation, Member, publisher, Server } from "@discorde/datamodel";

export class JoinController {
  private memberRepository = getRepository(Member);
  private invitationRepository = getRepository(Invitation);

  private async findInvitation(res: Response, inviteString: any) {
    try {
      return await this.invitationRepository.findOneOrFail({where: { url: inviteString }, relations: ["server"]});
    } catch (e) {
      res.status(404).send(`Invitation ${inviteString} doesnt exist`);
      return null;
    }
  }

  async join(req: Request, res: Response) {
    const invitation = await this.findInvitation(res, req.params.inviteString);
    if (!invitation)
      return;
    if (Date.now() > Number(invitation.expirationDate)) {
      res.status(404).send("Expired invitation");
    }
    const server = invitation.server;
    const existingMember = await server.getUser(res.locals.user.id);
    if (existingMember) {
      if (!existingMember.quit) {
        res.status(404).send(`Already Member of Server ${server.name}`);
        return;
      } else {
        existingMember.quit = false;
        await this.memberRepository.save(existingMember);
        const memberSend = await this.memberRepository.find({where: { id: existingMember.id }, relations: ["user"]});
        publisher.publish(`server:${server.id}`, JSON.stringify({action: "memberAdd", data: memberSend}))
        const serverSend = await getRepository(Server).findOne(server.id, {
          relations: ["members", "members.user", "channels", "roles", "roles.members"]
        });
        return serverSend;
      }
    } else {
      let member = new Member();
      member.server = server;
      member.user = res.locals.user;
      member.roles = [await server.getEveryoneRole()];
      await this.memberRepository.save(member);
      const memberSend = await this.memberRepository.find({where: { id: member.id }, relations: ["user"]});
      const serverSend = await getRepository(Server).findOne(server.id, {
        relations: ["members", "members.user", "channels", "roles", "roles.members"]
      });
      publisher.publish(`server:${server.id}`, JSON.stringify({action: "memberAdd", data: memberSend}));
      publisher.publish(`user:${res.locals.user.id}`, JSON.stringify({action: "serverAdd", data: serverSend}));
      return serverSend;
    }
  }
}