import { UserController } from "./controller/users/UserController";
import { RelationshipController } from "./controller/users/RelationshipController";

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
    route: "/users/:userId/relationships",
    controller: RelationshipController,
    action: "all",
  },
  {
    method: "get",
    route: "/users/:userId/relationships/:relationshipId",
    controller: RelationshipController,
    action: "one",
  },
  {
    method: "post",
    route: "/users/:userId/relationships/:relationshipId",
    controller: RelationshipController,
    action: "add",
  },
  {
    method: "patch",
    route: "/users/:userId/relationships/:relationshipId",
    controller: RelationshipController,
    action: "update",
  },
  {
    method: "delete",
    route: "/users/:userId/relationships/:relationshipId",
    controller: RelationshipController,
    action: "remove",
  },
];
