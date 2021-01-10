import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Invitation, Server, User, UserRole } from "@discorde/datamodel";

export class InvitationController {
  private invitationRepository = getRepository(Invitation);
  private serverRepository = getRepository(Server);

  private async findServer(res: Response, serverId: any) {
    try {
      return await this.serverRepository.findOneOrFail({ where: { id: serverId } });
    } catch (e) {
      res.status(404).send(`Server ${serverId} doesnt exist`);
      return null;
    }
  }
  private async findInvitation(res: Response, invitationId: any, serverId: any) {
    try {
      return await this.invitationRepository.findOneOrFail({where: { id: invitationId, server: { id: serverId }}});
    } catch (e) {
      res.status(404).send(`Invitation ${invitationId} doesnt exist on server ${serverId}`);
      return null;
    }
  }

  async all(req: Request, res: Response) {
    const server = await this.findServer(res, req.params.serverId);
    if (!server)
      return;
    const member = await server.getUser(res.locals.user.id);
    if ((!member || !(await member.hasGlobalPermission("manageServer"))) && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    return this.invitationRepository.find({ where: { server: {id: req.params.serverId }}});
  }

  async add(req: Request, res: Response) {
    const { expirationDate } = req.body;
    if (!expirationDate) {
      res.status(404).send('Expiration date required');
      return;
    }

    const server = await this.findServer(res, req.params.serverId);
    if (!server)
      return;
    const member = await server.getUser(res.locals.user.id);
    if ((!member || !(await member.hasGlobalPermission("createInvite"))) && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    let invitation = new Invitation();
    invitation.server = server;
    invitation.url = Buffer.from(`${Date.now()}-${req.params.serverId}-${res.locals.user.id}`).toString('base64');
    invitation.expirationDate = expirationDate.toString();
    return this.invitationRepository.save(invitation);
  }

  async delete(req: Request, res: Response) {
    const server = await this.findServer(res, req.params.serverId);
    if (!server)
      return;
    const member = await server.getUser(res.locals.user.id);
    if ((!member || !(await member.hasGlobalPermission("manageServer"))) && res.locals.user.role !== UserRole.ADMIN) {
      res.status(404).send();
      return;
    }
    const invitation = await this.findInvitation(res, req.params.invitationId, req.params.serverId);
    if (!invitation)
      return;
    return this.invitationRepository.remove(invitation);
  }
}
