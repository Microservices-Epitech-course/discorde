import { User } from "@discorde/datamodel";
import { Request, Response } from "express";
import { getRepository } from "typeorm";

export class AccountController {
  private userRepository = getRepository(User);

  async register(req: Request, res: Response) {
    const { email, username, password } = req.body;

    try {
      await this.userRepository.save(this.userRepository.create({
        email,
        username,
        password,
      }));
      res.status(201).send("User created");
    } catch (e) {
      res.status(409).send("Username or Email already used");
      return;
    }
  }

  async remove(req: Request, res: Response) {
    const id = res.locals.jwtPayload.userId;
    try {
      const user = await this.userRepository.findOneOrFail(id);
      await this.userRepository.remove(user);
      res.status(204).send("User deleted");
      return;
    } catch (e) {
      res.status(404).send("User not found");
      return;
    }
  }

  async login(req: Request, res: Response) {
    const { email, username, password } = req.body;
    try {
      const user = await (async () => {
        if (email)
          return this.userRepository.findOneOrFail({where: { email }});
        else
          return this.userRepository.findOneOrFail({where: { username }});
      })();
      if (!user.checkPassword(password)) {
        res.status(401).send();
        return;
      }

      const token = user.getJWTToken();
      res.send(token);
    } catch (e) {
      res.status(401).send();
    }
  }
}