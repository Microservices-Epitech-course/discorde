import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { User } from "../entity";

const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = res.locals.jwtPayload.userId;

    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id);

      next();
      // if (roles.indexOf(user.role) > -1)
      //   next();
      // else
      //   res.status(401).send();
    } catch (id) {
      res.status(401).send();
    }
  }
}

export default checkRole;