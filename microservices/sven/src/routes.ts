import { AccountController } from "./controller/account/AccountController";

export const Routes = [
  {
    // Register
    method: "post",
    route: "/register",
    controller: AccountController,
    action: "register",
    noAuth: true,
  },
  // {
  //   // Email Confirmation
  //   method: "get",
  //   route: "/register/:userId",
  //   controller: AccountController,
  //   action: "confirm"
  // },
  {
    // Account Deletion
    method: "delete",
    route: "/account",
    controller: AccountController,
    action: "remove",
  },
  {
    // Login
    method: "post",
    route: "/auth",
    controller: AccountController,
    action: "login",
    noAuth: true,
  }
];
