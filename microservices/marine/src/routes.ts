import { ChannelController } from "./controller/ChannelController";
import { InvitationController } from "./controller/InvitationController";
import { MemberController } from "./controller/MemberController";
import { ServerController } from "./controller/ServerController";
import { RoleController } from "./controller/RoleController";
import { ChannelRoleController } from "./controller/ChannelRoleController";

export const Routes = [
    {
        // Get all Servers
        method: "get",
        route: "/servers",
        controller: ServerController,
        action: "all",
        adminOnly: true
    },
    {
        // Get one Server infos
        method: "get",
        route: "/servers/:serverId",
        controller: ServerController,
        action: "one",
    },
    {
        // Create a Server
        method: "post",
        route: "/servers",
        controller: ServerController,
        action: "add",
    },
    {
        // Modify Server Name
        method: "patch",
        route: "/servers/:serverId",
        controller: ServerController,
        action: "modif"
    },
    {
        // Delete a Server
        method: "delete",
        route: "/servers/:serverId",
        controller: ServerController,
        action: "remove",
    },


    {
        // Get All Members in Server
        method: "get",
        route: "/servers/:serverId/members",
        controller: MemberController,
        action: "all",
    },
    {
        // Get One Member in Server
        method: "get",
        route: "/servers/:serverId/members/:memberId",
        controller: MemberController,
        action: "one",
    },
    {
        // Create One Member in Server
        method: "post",
        route: "/servers/:serverId/members/:userId",
        controller: MemberController,
        action: "add",
        adminOnly: true,
    },
    {
        // Delete One Member in Server (can @me)
        method: "delete",
        route: "/servers/:serverId/members/:memberId",
        controller: MemberController,
        action: "remove",
    },
    {
        // Change Member Server Roles
        method: "patch",
        route: "/servers/:serverId/members/:memberId/roles",
        controller: RoleController,
        action: "changeRole",
    },

    {
        // Get all Channel in a Server
        method: "get",
        route: "/servers/:serverId/channels",
        controller: ChannelController,
        action: "all",
    },
    {
        // Get a Channel Infos in a Server
        method: "get",
        route: "/servers/:serverId/channels/:channelId",
        controller: ChannelController,
        action: "one",
    },
    {
        // Create a Channel in a Server
        method: "post",
        route: "/servers/:serverId/channels",
        controller: ChannelController,
        action: "add",
    },
    {
        // Modify a Channel name in a Server
        method: "patch",
        route: "/servers/:serverId/channels/:channelId",
        controller: ChannelController,
        action: "modif",
    },
    {
        // Delete a channel in a Server
        method: "delete",
        route: "/servers/:serverId/channels/:channelId",
        controller: ChannelController,
        action: "remove",
    },


    {
        // Get Server Invitations
        method: "get",
        route: "/servers/:serverId/invitations",
        controller: InvitationController,
        action: "all"
    },
    {
        // Create Server Invitation
        method: "post",
        route: "/servers/:serverId/invitations",
        controller: InvitationController,
        action: "add"
    },
    {
        // Delete Server Invitation
        method: "delete",
        route: "/servers/:serverId/invitations/:invitationId",
        controller: InvitationController,
        action: "remove"
    },


    {
        method: "get",
        route: "/servers/:serverId/roles",
        controller: RoleController,
        action: "all",
    },
    {
        method: "post",
        route: "/servers/:serverId/roles",
        controler: RoleController,
        action: "add",
    },
    {
        method: "patch",
        route: "/servers/:serverId/roles/:roleId",
        controler: RoleController,
        action: "modif",
    },
    {
        method: "delete",
        route: "/servers/:serverId/roles/:roleId",
        controler: RoleController,
        action: "remove",
    },


    {
        method: "get",
        route: "/servers/:serverId/channels/:channelId/roles/",
        controller: ChannelRoleController,
        action: "all",
    },
    {
        method: "post",
        route: "/servers/:serverId/channels/:channelId/roles/:roleId",
        controler: ChannelRoleController,
        action: "add",
    },
    {
        method: "patch",
        route: "/servers/:serverId/channels/:channelId/roles/:channelRoleId",
        controler: ChannelRoleController,
        action: "modif",
    },
    {
        method: "delete",
        route: "/servers/:serverId/channels/:channelId/roles/:channelRoleId",
        controler: ChannelRoleController,
        action: "remove",
    },

];
