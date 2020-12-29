import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Relation, RelationStatus, User, UserRole } from "@discorde/datamodel";

export class RelationController {
  private relationRepository = getRepository(Relation);

  private async getRelation(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      return null;
    }
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;
    const relation = this.relationRepository.findOne({
      where: {
        userOneId: Math.min(Number(userId), Number(req.params.relationId)),
        userTwoId: Math.max(Number(userId), Number(req.params.relationId)),
      },
      relations: ['users']
    });
    if (!relation)
      return null;
    return relation;
  }

  async all(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;
    return this.relationRepository.find({
      where: [{ userOneId: userId }, { userTwoId: userId }],
      relations: ['users']
    });
  }

  async one(req: Request, res: Response) {
    const relation = await this.getRelation(req, res);
    if (!relation) {
      res.status(404).send();
      return;
    }
    return relation;
  }

  async add(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;
    const existing = await this.getRelation(req, res);

    if (existing)
      return existing;
    let relation = new Relation();
    relation.userOneId = Math.min(Number(userId), Number(req.params.relationId));
    relation.userTwoId = Math.max(Number(userId), Number(req.params.relationId));
    relation.actionUserId = Number(userId);
    relation.status = RelationStatus.PENDING;
    relation.users = await getRepository(User).findByIds([relation.userOneId, relation.userTwoId])

    return (await this.relationRepository.save(relation));
  }

  async update(req: Request, res: Response) {
    let relation = await this.one(req, res);

    if (!relation)
      return;
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

  async remove(req: Request, res: Response) {
    let relationToRemove = await this.one(req, res);

    if (!relationToRemove)
      return;
    return this.relationRepository.remove(relationToRemove);
  }
}
