import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Channel, Member, Server, User, UserRole, ChannelType } from "@discorde/datamodel";

export class ServerController {
    private serverRepository = getRepository(Server);

    async all(_: Request, res: Response) {
        if (res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        let relations = ['members', 'channels', 'roles'];
        if (res.locals.user.role === UserRole.ADMIN) {
            relations.push('invitations');
        }
        return this.serverRepository.find({ relations: relations });
    }

    async one(req: Request, res: Response) {
        let relations = ['members', 'channels', 'roles'];
        if (res.locals.user.role === UserRole.ADMIN) {
            relations.push('invitations');
        }
        const server = await this.serverRepository.findOne({
            where: { id: req.params.serverId },
            relations: relations
        });
        if (!server.hasMember(res.locals.user.id) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        return server;
    }

    async add(_: Request, res: Response) {
        let creatorMember = new Member();
        let mainChannel = new Channel();
        let server = new Server();

        creatorMember.user = res.locals.user;
        mainChannel.name = "Main";
        mainChannel.server = server;
        mainChannel.type = ChannelType.TEXTUAL;
        server.members = [creatorMember];

        await getRepository(Member).save(creatorMember)
        await getRepository(Member).save(mainChannel)
        return (await this.serverRepository.save(server));
    }

    async remove(req: Request, res: Response) {
        let server = await this.one(req, res);
        // TODO: Check if member have enough permissions to delete server
        if (!server.hasMember(res.locals.user.id) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        return this.serverRepository.remove(server);
    }
}
