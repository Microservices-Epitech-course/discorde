import { getRepository } from "typeorm";
import { Request } from "express";
import { Member, Server, User } from "@discorde/datamodel";

export class ServerController {
    private serverRepository = getRepository(Server);

    async all(req: Request) {
        return this.serverRepository.find();
    }

    async one(req: Request) {
        return this.serverRepository.findOne({
            where: { id: req.params.serverId }
        });
    }

    async add(req: Request) {
        const user = await getRepository(User).findOne({ where: { id: req.body.creatorId } })
        const creatorMember = await getRepository(Member).save({ user })
        const server = this.serverRepository.create({ members: [creatorMember] })
        creatorMember.server = server;
        return this.serverRepository.save(server);
    }

    async remove(req: Request) {
        let serverToRemove = await this.one(req);
        return this.serverRepository.remove(serverToRemove);
    }
}
