import { getRepository } from "typeorm";
import { Request } from "express";
import { Member, Server, User } from "@discorde/datamodel";

export class ServerController {
    private serverRepository = getRepository(Server);

    async all(req: Request) {
        return this.serverRepository.find({ relations: ['members', 'channels', 'roles', 'invitations'] });
    }

    async one(req: Request) {
        return this.serverRepository.findOne({
            where: { id: req.params.serverId },
            relations: ['members', 'channels', 'roles', 'invitations']
        });
    }

    async add(req: Request) {
        const user = await getRepository(User).findOne({ where: { id: req.body.creatorId } })
        let creatorMember = new Member();
        let server = new Server();

        creatorMember.user = user;
        server.members = [creatorMember];

        await getRepository(Member).save(creatorMember)
        return (await this.serverRepository.save(server));
    }

    async remove(req: Request) {
        let serverToRemove = await this.one(req);
        return this.serverRepository.remove(serverToRemove);
    }
}
