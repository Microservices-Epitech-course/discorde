import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Invitation, Member, UserRole } from "@discorde/datamodel";
import * as redis from "redis";

export class JoinController {
  private memberRepository = getRepository(Member);
  private invitationRepository = getRepository(Invitation);
  private publisher = redis.createClient(process.env.REDIS_URL);

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
    if (Date.now() > invitation.expirationDate.getTime()) {
      res.status(404).send("Expired invitation");
    }
    const server = invitation.server;
    const user = await server.getUser(Number(req.params.userId));
    if (user) {
      if (!user.quit) {
        res.status(404).send(`Already Member of Server ${server.name}`);
        return;
      } else {
        user.quit = false;
        return this.memberRepository.save(user);
      }
    } else {
      let member = new Member();
      member.server = server;
      member.user = res.locals.user;
      member.roles = [await server.getEveryoneRole()];
      return this.memberRepository.save(member);
    }
  }
}