import { UserController } from "./controller/users/UserController";
import { RelationController } from "./controller/users/RelationController";

export const Routes = [
  {
    // Get All Users
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    adminOnly: true,
  },
  {
    // Get User Infos
    method: "get",
    route: "/users/:userId",
    controller: UserController,
    action: "one",
  },
  {
    // Change User username
    method: "patch",
    route: "/users/:userId",
    controller: UserController,
    action: "update",
  },

  {
    // Get all User Relations
    method: "get",
    route: "/users/:userId/relations",
    controller: RelationController,
    action: "all",
  },
  {
    // Get one User Relation
    method: "get",
    route: "/users/:userId/relations/:userTwoId",
    controller: RelationController,
    action: "one",
  },
  {
    // Friend Request
    method: "post",
    route: "/users/:userId/relations/:userTwoId",
    controller: RelationController,
    action: "add",
  },
  {
    // Modify Relation
    method: "patch",
    route: "/users/:userId/relations/:userTwoId",
    controller: RelationController,
    action: "update",
  },
  {
    // Delete Relation
    method: "delete",
    route: "/users/:userId/relations/:userTwoId",
    controller: RelationController,
    action: "remove",
  },
];
