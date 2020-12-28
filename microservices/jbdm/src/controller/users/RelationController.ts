import { getRepository } from "typeorm";
import { Request } from "express";
import { Relation, RelationStatus } from "@discorde/datamodel";

export class RelationController {
  private relationRepository = getRepository(Relation);

  async all(req: Request) {
    return this.relationRepository.find({
      where: [{ userOneId: req.params.userId }, { userTwoId: req.params.userId }],
      relations: ['users']
    });
  }

  async one(req: Request) {
    return this.relationRepository.findOne({
      where: {
        userOneId: Math.min(Number(req.params.userId), Number(req.params.relationId)),
        userTwoId: Math.max(Number(req.params.userId), Number(req.params.relationId)),
      },
      relations: ['users']
    });
  }

  async add(req: Request) {
    return this.relationRepository.save({
      userOneId: Math.min(Number(req.params.userId), Number(req.params.relationId)),
      userTwoId: Math.max(Number(req.params.userId), Number(req.params.relationId)),
      actionUserId: Number(req.params.userId),
      status: RelationStatus.PENDING,
    })
  }

  async update(req: Request) {
    let relation = await this.one(req);
    switch (req.query.action) {
      case "accept":
        relation.status = RelationStatus.ACCEPTED;
        break;
      case "deny":
        relation.status = RelationStatus.DECLINED;
        break;
      case "block":
        relation.status = RelationStatus.BLOCKED;
        break;
    }
    relation.actionUserId = Number(req.params.userId);
    return this.relationRepository.save(relation);
  }

  async remove(req: Request) {
    let relationToRemove = await this.one(req);
    return this.relationRepository.remove(relationToRemove);
  }
}
