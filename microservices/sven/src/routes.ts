import { AccountController } from "./controller/account/AccountController";

export const Routes = [
  {
    method: "get",
    route: "/account/:userId",
    controller: AccountController,
    action: "confirm"
  },
  {
    method: "post",
    route: "/account",
    controller: AccountController,
    action: "register",
  },
  {
    method: "delete",
    route: "/account/:userId",
    controller: AccountController,
    action: "remove",
  },

  {
    method: "goet",
    route: "/auth",
  }
];
