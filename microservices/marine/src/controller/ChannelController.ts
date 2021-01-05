import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Channel, Server, UserRole } from "@discorde/datamodel";

export class ChannelController {
    private channelRepository = getRepository(Channel);
    private serverRepository = getRepository(Server);

    private async findServer(res: Response, serverId: any) {
        try {
          return await this.serverRepository.findOneOrFail({ where: { id: serverId } });
        } catch (e) {
          res.status(404).send(`Server ${serverId} doesnt exist`);
          return null;
        }
    }
    private async findChannel(res, channelId: any, serverId: any, relations?: any) {
        try {
            this.channelRepository.findOneOrFail({where: { id: channelId, server: { id: serverId }}, relations});
        } catch (e) {
            res.status(404).send(`Channel ${channelId} doesnt exist on Server ${serverId}`);
            return null;
        }
    }

    async all(req: Request, res: Response) {
        const server = await this.findServer(res, req.params.serverId);
        if (!server)
            return;
        if (!(await server.hasUser(res.locals.user.id)) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        const channels = await this.channelRepository.find({ where: { server: {id: req.params.serverId }}, relations: ['channelRoleSettings', 'messages', 'server'] });
        if (res.locals.user.role !== UserRole.ADMIN) {
            const callerMember = await server.getUser(res.locals.user.id);
            const filteredChannels = [];
            for (let i in channels) {
                if ((await callerMember.hasChannelPermission("viewChannels", channels[i].id)))
                    filteredChannels.push(channels[i]);
            }
            return filteredChannels;
        } else {
            return channels;
        }
    }

    async one(req: Request, res: Response) {
        const server = await this.findServer(res, req.params.serverId);
        if (!server)
            return;
        if (!(await server.hasUser(res.locals.user.id)) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        const channel = await this.findChannel(res, req.params.channelId, req.params.serverId, ['channelRoleSettings', 'messages', 'server']);
        if (res.locals.user.role !== UserRole.ADMIN) {
            const callerMember = await server.getUser(res.locals.user.id);
            if ((await callerMember.hasChannelPermission("viewChannels", channel.id))) {
                return channel;
            } else {
                res.status(404).send();
                return;
            }
        } else {
            return channel;
        }
    }

    async add(req: Request, res: Response) {
        const { name } = req.body;
        if (!name) {
            res.status(404).send("Missing parameter name");
            return;
        }
        const server = await this.findServer(res, req.params.serverId);
        if (!server)
            return;
        if (!(await server.hasUser(res.locals.user.id)) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        if (res.locals.user.role !== UserRole.ADMIN) {
            const callerMember = await server.getUser(res.locals.user.id);
            if (!(await callerMember.hasGlobalPermission("manageChannels"))) {
                res.status(404).send();
                return;
            }
        }
        let channel = new Channel();
        channel.type = req.body.type;
        channel.server = server;
        return (await this.channelRepository.save(channel))
    }

    async modif(req: Request, res: Response) {
        const { name } = req.body;
        if (!name) {
            res.status(404).send("Missing parameter name");
            return;
        }
        const server = await this.findServer(res, req.params.serverId);
        if (!server)
            return;
        if (!(await server.hasUser(res.locals.user.id)) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        if (res.locals.user.role !== UserRole.ADMIN) {
            const callerMember = await server.getUser(res.locals.user.id);
            if (!(await callerMember.hasChannelPermission("manageChannels", Number(req.params.channelId)))) {
                res.status(404).send();
                return;
            }
        }
        const channel = await this.findChannel(res, req.params.channelId, req.params.serverId);
        if (!channel)
            return;
        channel.name = name;
        return this.channelRepository.save(channel);
    }

    async remove(req: Request, res: Response) {
        const server = await this.findServer(res, req.params.serverId);
        if (!server)
            return;
        if (!(await server.hasUser(res.locals.user.id)) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        if (res.locals.user.role !== UserRole.ADMIN) {
            const callerMember = await server.getUser(res.locals.user.id);
            if (!(await callerMember.hasChannelPermission("manageChannels", Number(req.params.channelId)))) {
                res.status(404).send();
                return;
            }
        }
        let channel = await this.findChannel(res, req.params.channelId, req.params.serverId);
        if (!channel)
            return;
        return this.channelRepository.remove(channel);
    }
}
