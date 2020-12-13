import { getRepository } from "typeorm";
import { Request } from "express";
import { User, Relation } from "@discorde/datamodel";

export class UserController {
  private userRepository = getRepository(User);

  async all() {
    return this.userRepository.find();
  }

  async one(req: Request) {
    return this.userRepository.findOne(req.params.userId);
  }

  async add(req: Request) {
    return this.userRepository.save(req.body);
  }

  async update(req: Request) {
    return this.userRepository.update(req.params.userId, req.body);
  }

  async remove(req: Request) {
    return this.userRepository.remove(await this.one(req));
  }
}
