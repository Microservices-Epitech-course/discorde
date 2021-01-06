import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Member, ServerType, UserRole } from "@discorde/datamodel";

export class ListController {
  private memberRepository = getRepository(Member);

  async conversations(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(401).send("Cant get someone else conversations");
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
      relations: ["server", "server.members", "server.members.user"]
    });
    return members.filter((e) => e.server.type === ServerType.CONVERSATION).map((e) => e.server);
  }

  async servers(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(401).send("Cant get someone else servers");
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
      relations: ["server"]
    });
    return members.filter((e) => e.server.type === ServerType.SERVER).map((e) => e.server);
  }
}