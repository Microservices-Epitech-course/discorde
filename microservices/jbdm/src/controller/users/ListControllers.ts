import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Member, ServerType, UserRole } from "@discorde/datamodel";

export class ListController {
  private memberRepository = getRepository(Member);

  async conversations(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(401).send();
      return;
    }
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;

    const members = await this.memberRepository.find({
      where: {
        user: {
          id: userId
        },
        quit: false,
      },
      relations: ["server", "server.channels", "server.members", "server.members.user"]
    });
    console.log(members);
    return members.filter((e) => e.server.type === ServerType.CONVERSATION);
  }

  async servers(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(401).send();
      return;
    }
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;

    const members = await this.memberRepository.find({
      where: {
        user: {
          id: userId
        },
        quit: false,
      },
      relations: ["server", "server.channels", "server.members", "server.members.user"]
    });
    return members.filter((e) => e.server.type === ServerType.SERVER);
  }
}