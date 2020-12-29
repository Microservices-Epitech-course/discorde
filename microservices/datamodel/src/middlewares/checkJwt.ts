import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import jwtSecret from "../config/jwtSecret";
import { User } from "../entity";

const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers["authorization"];

  try {
    const jwtPayload = <any>jwt.verify(token, jwtSecret);
    res.locals.jwtPayload = jwtPayload;
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({userId, username}, jwtSecret, { expiresIn: "1h" });
    res.setHeader("token", newToken);
    res.locals.user = await getRepository(User).findOne(userId);
    next();
    return;
  } catch (error) {
    res.status(401).send({
      "error": "401",
      "message": "Authorization required"
    });
    return;
  }
}

export default checkJwt;