import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { publisher, User, UserRole } from "@discorde/datamodel";

export class UserController {
  private userRepository = getRepository(User);

  async all() {
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
    if (!username) {
      res.status(404).send();
      return;
    }
    try {
      const user = await this.userRepository.findOneOrFail(userId);
      user.username = username;
      return await this.userRepository.save(user);
    } catch (e) {
      res.status(404).send();
      return;
    }
  }
}
