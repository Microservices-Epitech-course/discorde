import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Channel, ChannelRoleSettings, Role, Server, UserRole } from "@discorde/datamodel";

export class ChannelRoleController {
  private channelRoleRepository = getRepository(ChannelRoleSettings);
  private roleRepository = getRepository(Role);
  private serverRepository = getRepository(Server);
  private channelRepository = getRepository(Channel);

  private async findServer(res: Response, serverId: any) {
    try {
      return await this.serverRepository.findOneOrFail({ where: { id: serverId } });
    } catch (e) {
      res.status(404).send(`Server ${serverId} doesnt exist`);
      return null;
    }
  }
  private async findChannel(res: Response, channelId: any, serverId: any) {
    try {
      return await this.channelRepository.findOneOrFail({ where: { id: channelId, server: { id: serverId} } });
    } catch (e) {
      res.status(404).send(`Channel ${channelId} doesnt exist on Server ${serverId}`);
      return null;
    }
  }
  private async findChannelRole(res: Response, roleId: any, channelId: any, serverId: any) {
    try {
      return await this.channelRoleRepository.findOneOrFail({where: { id: roleId, server: { id: serverId }, channel: { id: channelId }}});
    } catch (e) {
      res.status(404).send(`Channel Role ${roleId} doesnt exist on Server ${serverId} and Channel ${channelId}`);
      return null;
    }
  }
  private async findRole(res: Response, roleId: any, serverId: any) {
    try {
      return await this.roleRepository.findOneOrFail({where: { id: roleId, server: { id: serverId }}});
    } catch (e) {
      res.status(404).send(`Role ${roleId} doesnt exist on server ${serverId}`);
      return null;
    }
  }


  async all(req: Request, res: Response) {
    const server = await this.findServer(res, req.params.serverId);
    if (!server)
      return;
    const channel = await this.findChannel(res, req.params.channelId, req.params.serverId);
    if (!channel)
      return;
    const member = await server.getUser(res.locals.user.id);
    if (!member && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    if (res.locals.user.role !== UserRole.ADMIN) {
      if (!(await member.hasChannelPermission("viewChannels", Number(req.params.channelId)))) {
        res.status(404).send();
        return;
      }
    }
    return this.channelRoleRepository.find({ where: { server: {id: req.params.serverId }, channel: { id: req.params.channelId }}});
  }

  async add(req: Request, res: Response) {
    const server = await this.findServer(res, req.params.serverId);
    if (!server)
      return;
    const channel = await this.findChannel(res, req.params.channelId, req.params.serverId);
    if (!channel)
      return;
    const role = await this.findRole(res, req.params.roleId, req.params.serverId);
    if (!role)
      return;
    const member = await server.getUser(res.locals.user.id);
    if ((!member || !(await member.hasChannelPermission("manageRoles", Number(req.params.channelId)))) && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    let channelRole = new ChannelRoleSettings();
    channelRole.channel = channel;
    channelRole.role = role;
    return this.channelRoleRepository.save(channelRole);
  }

  async modif(req: Request, res: Response) {
    const server = await this.findServer(res, req.params.serverId);
    if (!server)
      return;
    const channel = await this.findChannel(res, req.params.channelId, req.params.serverId);
    if (!channel)
      return;
    const member = await server.getUser(res.locals.user.id);
    if ((!member || !(await member.hasChannelPermission("manageRoles", Number(req.params.channelId)))) && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    const channelRole = await this.findChannelRole(res, req.params.channelRoleId, req.params.channelId, req.params.serverId);
    if (!channelRole)
      return;
    channelRole.viewChannels = req.body.viewChannels || channelRole.viewChannels;
    channelRole.manageChannels = req.body.manageChannels || channelRole.manageChannels;
    channelRole.managePermissions = req.body.managePermissions || channelRole.managePermissions;
    channelRole.sendMessages = req.body.sendMessages || channelRole.sendMessages;
    channelRole.addReactions = req.body.addReactions || channelRole.addReactions;
    channelRole.mentionRoles = req.body.mentionRoles || channelRole.mentionRoles;
    channelRole.manageMessages = req.body.manageMessages || channelRole.manageMessages;
    return this.channelRoleRepository.save(channelRole);
  }

  async delete(req: Request, res: Response) {
    const server = await this.findServer(res, req.params.serverId);
    if (!server)
      return;
    const channel = await this.findChannel(res, req.params.channelId, req.params.serverId);
    if (!channel)
      return;
    const member = await server.getUser(res.locals.user.id);
    if ((!member || !(await member.hasGlobalPermission("manageRoles"))) && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    const channelRole = await this.findChannelRole(res, req.params.channelRoleId, req.params.channelId, req.params.serverId);
    if (!channelRole)
      return;
    return this.channelRoleRepository.remove(channelRole);
  }
}
