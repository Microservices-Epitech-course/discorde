import { getRepository } from "typeorm";
import { Request } from "express";
import { Relation, RelationStatus } from "@discorde/datamodel";

export class RelationController {
  private relationRepository = getRepository(Relation);

  async all(req: Request) {
    return this.relationRepository.find({
      where: [{ userOneId: req.params.userId }, { userTwoId: req.params.userId }],
    });
  }

  async one(req: Request) {
    return this.relationRepository.findOne({
      where: {
        userOneId: Math.min(req.params.userId, req.params.relationId),
        userTwoId: Math.max(req.params.userId, req.params.relationId),
      },
    });
  }

  async add(req: Request) {
    return this.relationRepository.save({
      userOneId: Math.min(req.params.userId, req.params.relationId),
      userTwoId: Math.max(req.params.userId, req.params.relationId),
      actionUserId: req.params.userId,
      status: RelationStatus.PENDING,
    });
  }

  async update(req: Request) {
    let relationToUpdate = await this.one(req);
    switch (req.query.action) {
      case "accept":
        relationToUpdate.status = RelationStatus.ACCEPTED;
        break;
      case "deny":
        relationToUpdate.status = RelationStatus.DECLINED;
        break;
      case "block":
        relationToUpdate.status = RelationStatus.BLOCKED;
        break;
    }
    relationToUpdate.actionUserId = req.params.userId;
    return this.relationRepository.save(relationToUpdate);
  }

  async remove(req: Request) {
    let relationToRemove = await this.one(req);
    return this.relationRepository.remove(relationToRemove);
  }
}
