import *  as express from "express";
import { Request, Response, NextFunction } from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { Connection } from "typeorm";
import checkJwt from "../middlewares/checkJwt";
import checkRole from "../middlewares/checkRole";
import { UserRole } from "../entity";

export interface Routes {
  method: string,
  route: string,
  controller: any,
  action: string,
  noAuth?: boolean,
  adminOnly?: boolean,
}

const empty = (req: Request, res: Response, next: NextFunction) => next();

const configServer = async (port: number, routes: Array<Routes>, connection: Connection, name: String) => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  routes.forEach((route) => {
    app[route.method](
      route.route,
      route.noAuth ? empty : checkJwt,
      route.noAuth ? empty : checkRole(route.adminOnly ? [UserRole.ADMIN] : [UserRole.USER, UserRole.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
      const result = new route.controller()[route.action](req, res, next);
      if (result instanceof Promise) {
        result.then((result) => (result !== null && result !== undefined ? res.send(result) : undefined));
      } else if (result !== null && result !== undefined) {
        res.json(result);
      }
    });
  });

  app.listen(port, () => {
    console.log(`[${name}]: Server has started on port ${port}.`);
  });
}

export default configServer;