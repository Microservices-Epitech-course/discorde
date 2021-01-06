import { getRepository, Not } from "typeorm";
import { Request, Response } from "express";
import { publisher, Relation, RelationStatus, User, UserRole } from "@discorde/datamodel";

export class RelationController {
  private relationRepository = getRepository(Relation);

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
  private async createRelation(userId1, userId2, status: RelationStatus) {
    try {
      const userTwo = await getRepository(User).findOneOrFail(userId2);

      let relation = new Relation();
      relation.userOneId = Math.min(userId1, userId2);
      relation.userTwoId = Math.max(userId1, userId2);
      relation.actionUserId = userId1;
      relation.status = status;
      relation.users = await getRepository(User).findByIds([relation.userOneId, relation.userTwoId]);

      await this.relationRepository.save(relation);
      publisher.publish(`user:${userId2}`, JSON.stringify({ action: "relationAdd", data: relation }));
      return relation;
    } catch (e) {
      return null;
    }
  }


  async all(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(401).send();
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
      res.status(404).send("Relation not found");
      return null;
    }
    return relation;
  }

  async friends(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(401).send();
      return;
    }
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;
    return this.relationRepository.find({
      where: [
        { userOneId: userId, status: RelationStatus.ACCEPTED },
        { userTwoId: userId, status: RelationStatus.ACCEPTED }
      ],
      relations: ['users'],
    });
  }

  async invitesSent(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(401).send();
      return;
    }
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;
    return this.relationRepository.find({
      where: [
        { userOneId: userId, actionUserId: userId, status: RelationStatus.PENDING },
        { userTwoId: userId, actionUserId: userId, status: RelationStatus.PENDING }
      ],
      relations: ['users'],
    });
  }

  async invitesReceived(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(401).send();
      return;
    }
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;
    return this.relationRepository.find({
      where: [
        { userOneId: userId, actionUserId: Not(userId), status: RelationStatus.PENDING },
        { userTwoId: userId, actionUserId: Not(userId), status: RelationStatus.PENDING }
      ],
      relations: ['users'],
    });
  }

  async blocked(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(401).send();
      return;
    }
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;
    return this.relationRepository.find({
      where: [
        { userOneId: userId, actionUserId: userId, status: RelationStatus.BLOCKED },
        { userTwoId: userId, actionUserId: userId, status: RelationStatus.BLOCKED }
      ],
      relations: ['users'],
    });
  }


  async add(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(401).send();
      return;
    }
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;
    if (userId === req.params.userTwoId) {
      res.status(403).send("Cant create Relation to self");
      return;
    }
    const existing = await this.getRelation(req, res);

    if (existing)
      return existing;
    const relation = await this.createRelation(userId, req.params.userTwoId, RelationStatus.PENDING)
    if (!relation)
      res.status(403).send("Relation creation failed");
    else
      return relation;
  }

  async addUsername(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(401).send();
      return;
    }
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;

    const userTwo = await getRepository(User).findOne({where: { username: req.params.username }});

    if (!userTwo) {
      res.status(404).send(`User ${req.params.username} not found`);
      return;
    }
    if (userId === userTwo.id) {
      res.status(403).send("Cant create Relation to self");
      return;
    }
    const existing = await this.relationRepository.findOne({
      where: {
        userOneId: Math.min(Number(userId), userTwo.id),
        userTwoId: Math.max(Number(userId), userTwo.id),
      },
      relations: ['users']
    });

    if (existing)
      return existing;
    const relation = await this.createRelation(userId, userTwo.id, RelationStatus.PENDING)
    if (!relation)
      res.status(403).send("Relation creation failed");
    else
      return relation;
  }

  async update(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(401).send();
      return;
    }
    let relation = await this.getRelation(req, res);
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;
    
    if (!relation || relation.actionUserId === userId) {
      if (req.params.action === "block") {
        const createdRelation = this.createRelation(userId, req.params.userTwoId, RelationStatus.BLOCKED);
        if (!createdRelation) {
          res.status(404).send(`User ${req.params.userTwoId} doesnt exist`);
          return;
        } else {
          return createdRelation;
        }
      } else {
        if (!relation)
          res.status(404).send(`Relation doesnt exist or action ${req.params.action} is invalid`);
        else
          res.status(403).send(`Cant accept or refuse own relation`);
        return;
      }
    }
    switch (req.params.action) {
      case "accept":
        relation.status = RelationStatus.ACCEPTED;
        break;
      case "deny":
        relation.status = RelationStatus.DECLINED;
        break;
      case "block":
        relation.status = RelationStatus.BLOCKED;
        break;
      default:
        res.status(404).send(`Unknown action ${req.params.action}`);
        return;
    }
    publisher.publish(`user:${req.params.userTwoId}`, JSON.stringify({ action: "relationUpdate", data: relation }));
    return await this.relationRepository.save(relation);
  }

  async remove(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(401).send();
      return;
    }
    let relation = await this.one(req, res);
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;

    if (!relation) {
      res.status(404).send("Relation not found");
      return;
    }
    publisher.publish(`user:${req.params.userTwoId}`, JSON.stringify({ action: "relationDelete", data: relation.id }));
    const relId = relation.id;
    await this.relationRepository.remove(relation);
    return {id: relId};
  }
}
