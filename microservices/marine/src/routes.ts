import { MemberController } from "./controller/MemberController";
import { ServerController } from "./controller/ServerController";

export const Routes = [
    {
        method: "get",
        route: "/servers",
        controller: ServerController,
        action: "all",
    },
    {
        method: "get",
        route: "/servers/:serverId",
        controller: ServerController,
        action: "one",
    },
    {
        method: "post",
        route: "/servers",
        controller: ServerController,
        action: "add",
    },
    {
        method: "delete",
        route: "/servers/:serverId",
        controller: ServerController,
        action: "remove",
    },
    {
        method: "get",
        route: "/servers/:serverId/members",
        controller: MemberController,
        action: "all",
    },
    {
        method: "get",
        route: "/servers/:serverId/members/:memberId",
        controller: MemberController,
        action: "one",
    },
    {
        method: "post",
        route: "/servers/:serverId/members",
        controller: MemberController,
        action: "add",
    },
    {
        method: "delete",
        route: "/servers/:serverId/members/:memberId",
        controller: MemberController,
        action: "remove",
    }
];
