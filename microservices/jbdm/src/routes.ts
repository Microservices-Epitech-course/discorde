import { UserController } from "./controller/users/UserController";
import { RelationController } from "./controller/users/RelationController";
import { JoinController } from "./controller/users/JoinController";
import { ConversationController } from "./controller/users/ConversationController";
import { ListController } from "./controller/users/ListControllers";

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
    method: "post",
    route: "/users/join/:inviteString",
    controller: JoinController,
    action: "join"
  },


  {
    // Get all User Relations
    method: "get",
    route: "/users/:userId/relations",
    controller: RelationController,
    action: "all",
    adminOnly: true,
  },
  {
    // Get one User Relation
    method: "get",
    route: "/users/:userId/relations/:userTwoId",
    controller: RelationController,
    action: "one",
    adminOnly: true,
  },
  {
    // Get User friends
    method: "get",
    route: "/users/:userId/friends",
    controller: RelationController,
    action: "friends"
  },
  {
    // Get User Invites Sent
    method: "get",
    route: "/users/:userId/invites/sent",
    controller: RelationController,
    action: "invitesSent"
  },
  {
    // Get User Invites Received
    method: "get",
    route: "/users/:userId/invites/received",
    controller: RelationController,
    action: "invitesReceived"
  },
  {
    //Get User Blocked
    method: "get",
    route: "/users/:userId/blocked",
    controller: RelationController,
    action: "blocked"
  },
  {
    // Friend Request
    method: "post",
    route: "/users/:userId/relations/:userTwoId",
    controller: RelationController,
    action: "add",
  },
  {
    // Friend Request via Username
    method: "post",
    route: "/users/:userId/relations/username/:username",
    controller: RelationController,
    action: "addUsername",
  },
  {
    // Modify Relation
    method: "patch",
    route: "/users/:userId/relations/:userTwoId/:action",
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


  {
    // Create Conversation with other users
    method: "post",
    route: "/users/conversations",
    controller: ConversationController,
    action: "add",
  },


  {
    // Get all Conversations
    method: "get",
    route: "/users/:userId/conversations",
    controller: ListController,
    action: "conversations"
  },
  {
    // Get all Servers
    method: "get",
    route: "/users/:userId/servers",
    controller: ListController,
    action: "servers"
  },
];
