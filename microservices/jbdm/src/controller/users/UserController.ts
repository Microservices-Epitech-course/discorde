import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User, UserRole } from "@discorde/datamodel";
import * as redis from "redis";

export class UserController {
  private userRepository = getRepository(User);
  private publisher = redis.createClient();

  async all(req: Request, res: Response) {
    return this.userRepository.find({ relations: ['relations', 'members'] });
  }

  async one(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;
    return this.userRepository.findOne(userId, { relations: ['relations', 'members'] });
  }

  async update(req: Request, res: Response) {
    if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;
    const { username } = req.body;
    const user = await this.userRepository.findOne(userId);
    user.username = username;
    this.publisher.publish(`user:${userId}`, JSON.stringify({action: "userUpdate", data: user}))
    return await this.userRepository.save(user);
  }
}
