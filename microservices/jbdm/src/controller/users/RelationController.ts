import { getRepository } from "typeorm";
import { Request } from "express";
import { Relation, RelationStatus, User } from "@discorde/datamodel";

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
    let relation = new Relation();

    relation.userOneId = Math.min(Number(req.params.userId), Number(req.params.relationId));
    relation.userTwoId = Math.max(Number(req.params.userId), Number(req.params.relationId));
    relation.actionUserId = Number(req.params.userId);
    relation.status = RelationStatus.PENDING;
    relation.users = await getRepository(User).findByIds([relation.userOneId, relation.userTwoId])

    return (await this.relationRepository.save(relation));
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
    return (await this.relationRepository.save(relation));
  }

  async remove(req: Request) {
    let relationToRemove = await this.one(req);
    return this.relationRepository.remove(relationToRemove);
  }
}
