import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Member, ServerType } from "@discorde/datamodel";
import * as redis from "redis";

export class ListController {
  private memberRepository = getRepository(Member);

  async conversations(req: Request, res: Response) {
    const members = await this.memberRepository.find({
      where: {
        user: {
          id: res.locals.user.id
        },
        quit: false,
      },
      relations: ["server"]
    });
    return members.filter((e) => e.server.type === ServerType.CONVERSATION);
  }

  async servers(req: Request, res: Response) {
    const members = await this.memberRepository.find({
      where: {
        user: {
          id: res.locals.user.id
        },
        quit: false,
      },
      relations: ["server"]
    });
    return members.filter((e) => e.server.type === ServerType.SERVER);
  }
}