import { ChannelController } from "./controller/ChannelController";
import { MemberController } from "./controller/MemberController";
import { ServerController } from "./controller/ServerController";

export const Routes = [
    {
        method: "get",
        route: "/servers",
        controller: ServerController,
        action: "all",
        adminOnly: true
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
    },
    {
        method: "get",
        route: "/servers/:serverId/channels",
        controller: ChannelController,
        action: "all",
    },
    {
        method: "get",
        route: "/servers/:serverId/channels/:channelId",
        controller: ChannelController,
        action: "one",
    },
    {
        method: "post",
        route: "/servers/:serverId/channels",
        controller: ChannelController,
        action: "add",
    },
    {
        method: "delete",
        route: "/servers/:serverId/channels/:channelId",
        controller: ChannelController,
        action: "remove",
    }
];
