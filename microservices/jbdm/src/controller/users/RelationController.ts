import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Relation, RelationStatus, User, UserRole } from "@discorde/datamodel";
import * as redis from "redis";

export class RelationController {
  private relationRepository = getRepository(Relation);
  private publisher = redis.createClient(process.env.REDIS_URL);

  private async getRelation(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      return null;
    }
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;
    const relation = this.relationRepository.findOne({
      where: {
        userOneId: Math.min(Number(userId), Number(req.params.userTwoId)),
        userTwoId: Math.max(Number(userId), Number(req.params.userTwoId)),
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
    relation.userOneId = Math.min(Number(userId), Number(req.params.userTwoId));
    relation.userTwoId = Math.max(Number(userId), Number(req.params.userTwoId));
    relation.actionUserId = Number(userId);
    relation.status = RelationStatus.PENDING;
    relation.users = await getRepository(User).findByIds([relation.userOneId, relation.userTwoId])

    this.publisher.publish(`user:${req.params.userTwoId}`, JSON.stringify({ action: "relationAdd", data: relation }));
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
    this.publisher.publish(`user:${req.params.userTwoId}`, JSON.stringify({ action: "relationUpdate", data: relation }));
    return await this.relationRepository.save(relation);
  }

  async remove(req: Request, res: Response) {
    let relation = await this.one(req, res);

    if (!relation)
      return;
    this.publisher.publish(`user:${req.params.userTwoId}`, JSON.stringify({ action: "relationDelete", data: relation.id }));
    await this.relationRepository.remove(relation);
    return relation.id;
  }
}
