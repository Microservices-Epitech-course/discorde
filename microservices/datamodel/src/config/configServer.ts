import *  as express from "express";
import { Request, Response, NextFunction } from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { Connection } from "typeorm";

const configServer = async (port: number, routes: Array<any>, connection: Connection) => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  routes.forEach((route) => {
    app[route.method](route.route, (req: Request, res: Response, next: NextFunction) => {
      const result = new route.controller()[route.action](req, res, next);
      if (result instanceof Promise) {
        result.then((result) => (result !== null && result !== undefined ? res.send(result) : undefined));
      } else if (result !== null && result !== undefined) {
        res.json(result);
      }
    });
  });

  app.listen(port, () => {
    console.log(`Express server has started on port ${port}.`);
  });
}