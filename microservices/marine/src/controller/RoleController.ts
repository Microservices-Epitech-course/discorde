import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Role, Server, UserRole } from "@discorde/datamodel";

export class RoleController {
  private roleRepository = getRepository(Role);
  private serverRepository = getRepository(Server);

  private async findServer(res: Response, serverId: any) {
    try {
      return await this.serverRepository.findOneOrFail({ where: { id: serverId } });
    } catch (e) {
      res.status(404).send(`Server ${serverId} doesnt exist`);
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
    const member = await server.getUser(res.locals.user.id);
    if (!member && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    return this.roleRepository.find({ where: { server: {id: req.params.serverId }}, relations: ['members']});
  }

  async add(req: Request, res: Response) {
    const { name } = req.body;
    if (!name) {
      res.status(404).send('Missing parameter name');
      return;
    }

    const server = await this.findServer(res, req.params.serverId);
    if (!server)
      return;
    const member = await server.getUser(res.locals.user.id);
    if ((!member || !(await member.hasGlobalPermission("manageRoles"))) && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    let role = new Role();
    role.name = name;
    role.server = server;
    return this.roleRepository.save(role);
  }

  async modif(req: Request, res: Response) {
    const server = await this.findServer(res, req.params.serverId);
    if (!server)
      return;
    const member = await server.getUser(res.locals.user.id);
    if ((!member || !(await member.hasGlobalPermission("manageRoles"))) && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    const role = await this.findRole(res, req.params.roleId, req.params.serverId);
    if (!role)
      return;
    role.name = req.body.name || role.name;
    role.color = req.body.color || role.color;
    role.viewChannels = req.body.viewChannels || role.viewChannels;
    role.viewSeparately = req.body.viewSeparately || role.viewSeparately;
    role.allowMention = req.body.allowMention || role.allowMention;
    role.manageChannels = req.body.manageChannels || role.manageChannels;
    role.manageRoles = req.body.manageRoles || role.manageRoles;
    role.manageServer = req.body.manageServer || role.manageServer;
    role.createInvite = req.body.createInvite || role.createInvite;
    role.changeNickname = req.body.changeNickname || role.changeNickname;
    role.manageNickname = req.body.manageNickname || role.manageNickname;
    role.kickMembers = req.body.kickMembers || role.kickMembers;
    role.banMembers = req.body.banMembers || role.banMembers;
    role.sendMessages = req.body.sendMessages || role.sendMessages;
    role.addReactions = req.body.addReactions || role.addReactions;
    role.mentionRoles = req.body.mentionRoles || role.mentionRoles;
    role.manageMessages = req.body.manageMessages || role.manageMessages;
    // TODO : Prevent non admin to set admin
    role.administrator = req.body.administrator || role.administrator;
    return this.roleRepository.save(role);
  }

  async delete(req: Request, res: Response) {
    const server = await this.findServer(res, req.params.serverId);
    if (!server)
      return;
    const member = await server.getUser(res.locals.user.id);
    if ((!member || !(await member.hasGlobalPermission("manageRoles"))) && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    const role = await this.findRole(res, req.params.roleId, req.params.serverId);
    if (!role)
      return;
    if (role.isEveryone) {
      res.status(404).send("Cant delete everyone role");
      return;
    }
    return this.roleRepository.remove(role);
  }
}
