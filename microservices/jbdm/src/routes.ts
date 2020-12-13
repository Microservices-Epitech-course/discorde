import { UserController } from "./controller/users/UserController";
import { RelationController } from "./controller/users/RelationController";

export const Routes = [
  {
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
  },
  {
    method: "get",
    route: "/users/:userId",
    controller: UserController,
    action: "one",
  },
  {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "add",
  },
  {
    method: "patch",
    route: "/users/:userId",
    controller: UserController,
    action: "update",
  },
  {
    method: "delete",
    route: "/users/:userId",
    controller: UserController,
    action: "remove",
  },
  {
    method: "get",
    route: "/users/:userId/relations",
    controller: RelationController,
    action: "all",
  },
  {
    method: "get",
    route: "/users/:userId/relations/:relationId",
    controller: RelationController,
    action: "one",
  },
  {
    method: "post",
    route: "/users/:userId/relations/:relationId",
    controller: RelationController,
    action: "add",
  },
  {
    method: "patch",
    route: "/users/:userId/relations/:relationId",
    controller: RelationController,
    action: "update",
  },
  {
    method: "delete",
    route: "/users/:userId/relations/:relationId",
    controller: RelationController,
    action: "remove",
  },
];
