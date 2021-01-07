import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Channel, Member, Server, User, UserRole, ChannelType, Role } from "@discorde/datamodel";

export class ServerController {
    private serverRepository = getRepository(Server);

    private async findServer(res: Response, serverId: any) {
        try {
            return await this.serverRepository.findOneOrFail({ where: { id: serverId } });
        } catch (e) {
            res.status(404).send(`Server ${serverId} doesnt exist`);
            return null;
        }
    }
    
    async all(_: Request, res: Response) {
        if (res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        let relations = ["members", "members.user", "channels", "roles", "roles.members"];
        if (res.locals.user.role === UserRole.ADMIN) {
            relations.push('invitations');
        }
        return this.serverRepository.find({ relations: relations });
    }

    async one(req: Request, res: Response) {
        let relations = ["members", "members.user", "channels", "roles", "roles.members"];
        if (res.locals.user.role === UserRole.ADMIN) {
            relations.push('invitations');
        }
        const server = await this.serverRepository.findOne({
            where: { id: req.params.serverId },
            relations: relations
        });
        if (!(await server.hasUser(res.locals.user.id)) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        return server;
    }

    async add(req: Request, res: Response) {
        let creatorMember = new Member();
        let mainChannel = new Channel();
        let server = new Server();
        let everyoneRole = new Role();

        const { name } = req.body;
        if (!name) {
            res.status(404).send(`Missing name parameter`);
            return;
        }

        server.name = name;
        await this.serverRepository.save(server);

        creatorMember.user = res.locals.user;
        creatorMember.roles = [everyoneRole];
        creatorMember.server = server;
        creatorMember.owner = true;

        mainChannel.name = "Main";
        mainChannel.server = server;
        mainChannel.type = ChannelType.TEXTUAL;
    
        everyoneRole.name = "everyone";
        everyoneRole.isEveryone = true;
        everyoneRole.server = server;

        await getRepository(Channel).save(mainChannel);
        await getRepository(Role).save(everyoneRole);
        await getRepository(Member).save(creatorMember);
        const serverSend = await this.serverRepository.findOne(
            server.id, {
              relations: ["members", "members.user", "channels", "roles", "roles.members"]
            });
        return serverSend;
    }

    async modif(req: Request, res: Response) {
        const server = await this.findServer(res, req.params.serverId);
        if (!server)
            return;
        const { name } = req.body;
        if (!name) {
            res.status(404).send(`Missing name parameter`);
            return;
        }

        const member = await server.getUser(res.locals.user.id);
        if ((!member || !(await member.hasGlobalPermission("manageServer"))) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        server.name = name;
        return this.serverRepository.save(server);
    }

    async remove(req: Request, res: Response) {
        const server = await this.findServer(res, req.params.serverId);
        if (!server)
            return;
        const member = await server.getUser(res.locals.user.id);
        if ((!member || !member.owner) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        return this.serverRepository.remove(server);
    }
}
