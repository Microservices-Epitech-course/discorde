import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { Relationship, RelationshipStatus, User, UserStatus } from "@discorde/datamodel";

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
        const result = new (route.controller as any)()[route.action](req, res, next);
        if (result instanceof Promise) {
          result.then((result) => (result !== null && result !== undefined ? res.send(result) : undefined));
        } else if (result !== null && result !== undefined) {
          res.json(result);
        }
      });
    });

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    await connection.manager.remove(await connection.manager.find(User));
    await connection.manager.remove(await connection.manager.find(Relationship));

    // insert new users for test
    const user1 = await connection.manager.save(
      connection.manager.create(User, {
        email: "nudges@gmail.com" + Date.now(),
        username: "Nudges",
        password: "test",
        status: UserStatus.ONLINE,
      })
    );
    const user2 = await connection.manager.save(
      connection.manager.create(User, {
        email: "toto@gmail.com" + Date.now(),
        username: "Toto",
        password: "test",
        status: UserStatus.ONLINE,
      })
    );
    const relation = await connection.manager.save(
      connection.manager.create(Relationship, {
        userOneId: user1.id,
        userTwoId: user2.id,
        status: RelationshipStatus.PENDING,
        users: [user1, user2],
        actionUserId: user1.id,
      })
    );

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");
  })
  .catch((error) => console.log(error));
