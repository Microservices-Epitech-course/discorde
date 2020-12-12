import { getRepository } from "typeorm";
import { Request } from "express";
import { Relationship, RelationshipStatus } from "@discorde/datamodel";

export class RelationshipController {
  private relationshipRepository = getRepository(Relationship);

  async all(req: Request) {
    return this.relationshipRepository.find({
      where: [{ userOneId: req.params.userId }, { userTwoId: req.params.userId }],
    });
  }

  async one(req: Request) {
    return this.relationshipRepository.findOne({
      where: {
        userOneId: Math.min(req.params.userId, req.params.relationshipId),
        userTwoId: Math.max(req.params.userId, req.params.relationshipId),
      },
    });
  }

  async add(req: Request) {
    return this.relationshipRepository.save({
      userOneId: Math.min(req.params.userId, req.params.relationshipId),
      userTwoId: Math.max(req.params.userId, req.params.relationshipId),
      actionUserId: req.params.userId,
      status: RelationshipStatus.PENDING,
    });
  }

  async update(req: Request) {
    let relationshipToUpdate = await this.one(req);
    switch (req.query.action) {
      case "accept":
        relationshipToUpdate.status = RelationshipStatus.ACCEPTED;
        break;
      case "deny":
        relationshipToUpdate.status = RelationshipStatus.DECLINED;
        break;
      case "block":
        relationshipToUpdate.status = RelationshipStatus.BLOCKED;
        break;
    }
    relationshipToUpdate.actionUserId = req.params.userId;
    return this.relationshipRepository.save(relationshipToUpdate);
  }

  async remove(req: Request) {
    let relationshipToRemove = await this.one(req);
    await this.relationshipRepository.remove(relationshipToRemove);
  }
}
