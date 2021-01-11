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
        try {
            if (res.locals.user.role !== UserRole.ADMIN) {
                res.status(404).send();
                return;
            }
            let relations = ["members", "members.user", "channels", "roles", "roles.members"];
            if (res.locals.user.role === UserRole.ADMIN) {
                relations.push('invitations');
            }
            return this.serverRepository.find({ relations: relations });
        } catch (error) {
            return res.status(500).send(error);
        }
    }

    async one(req: Request, res: Response) {
        try {
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
        } catch (error) {
            return res.status(500).send(error);
        }
    }

    async add(req: Request, res: Response) {
        try {
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

            creatorMember.user = res.locals.user;
            creatorMember.roles = [everyoneRole];
            creatorMember.owner = true;

            mainChannel.name = "Main";
            mainChannel.type = ChannelType.TEXTUAL;
        
            everyoneRole.name = "everyone";
            everyoneRole.isEveryone = true;

            await getRepository(Channel).save(mainChannel);
            await getRepository(Role).save(everyoneRole);
            await getRepository(Member).save(creatorMember);

            server.members = [creatorMember];
            server.channels = [mainChannel];
            server.roles = [everyoneRole];

            await this.serverRepository.save(server);
            const serverSend = await this.serverRepository.findOne(
                server.id, {
                relations: ["members", "members.user", "channels", "roles", "roles.members"]
                });
            return serverSend;
        } catch (error) {
            return res.status(500).send(error);
        }
    }

    async modif(req: Request, res: Response) {
        try {
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
        } catch (error) {
            return res.status(500).send(error);
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const server = await this.findServer(res, req.params.serverId);
            if (!server)
                return;
            const member = await server.getUser(res.locals.user.id);
            if ((!member || !member.owner) && res.locals.user.role !== UserRole.ADMIN) {
                res.status(404).send();
                return;
            }
            return this.serverRepository.remove(server);
        } catch (error) {
            return res.status(500).send(error);
        }
    }
}
