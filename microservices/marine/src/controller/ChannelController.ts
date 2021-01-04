import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Channel, Server, UserRole } from "@discorde/datamodel";

export class ChannelController {
    private channelRepository = getRepository(Channel);

    async all(req: Request, res: Response) {
        const server = await getRepository(Server).findOne({ where: { id: req.params.serverId } })
        if (!server.hasMember(res.locals.user.id) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        // TODO: Remove channels user do not have perimissions to see
        return this.channelRepository.find({ where: { [server.id]: req.params.serverId }, relations: ['channelRoleSettings', 'messages', 'server'] });
    }

    async one(req: Request, res: Response) {
        const server = await getRepository(Server).findOne({ where: { id: req.params.serverId } })
        // TODO: Check if member have enough permissions to see this channel
        if (!server.hasMember(res.locals.user.id) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        return this.channelRepository.findOne({
            where: { id: req.params.channelId, [server.id]: req.params.serverId },
            relations: ['channelRoleSettings', 'messages', 'server']
        });
    }

    async add(req: Request, res: Response) {
        const server = await getRepository(Server).findOne({ where: { id: req.params.serverId } })
        // TODO: Check if member have enough permissions to create channel
        if (!server.hasMember(res.locals.user.id) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        let channel = new Channel();
        channel.type = req.body.type;
        channel.server = server;
        return (await this.channelRepository.save(channel))
    }

    async remove(req: Request, res: Response) {
        const server = await getRepository(Server).findOne({ where: { id: req.params.serverId } })
        // TODO: Check if member have enough permissions to delete channel
        if (!server.hasMember(res.locals.user.id) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        let channel = await this.one(req, res);
        return this.channelRepository.remove(channel);
    }
}
