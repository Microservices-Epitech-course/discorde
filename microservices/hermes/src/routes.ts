import { MessagesController } from "./controller/MessagesController";

export const Routes = [
  {
    // Get Messages
    method: "get",
    route: "/channels/:id/messages",
    controller: MessagesController,
    action: "get",
  },
  {
    // Send Message
    method: "post",
    route: "/channels/:id/messages",
    controller: MessagesController,
    action: "send",
  },
  {
    // Modify Message
    method: "patch",
    route: "/channels/:id/messages/:messageId",
    controller: MessagesController,
    action: "patch",
  },
  {
    // Delete Message
    method: "delete",
    route: "/channels/:id/messages/:messageId",
    controller: MessagesController,
    action: "delete",
  },
];
