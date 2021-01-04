import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Member, Server, User, UserRole } from "@discorde/datamodel";

export class MemberController {
    private memberRepository = getRepository(Member);

    async all(req: Request, res: Response) {
        const server = await getRepository(Server).findOne({ where: { id: req.params.serverId } })
        if (!server.hasMember(res.locals.user.id) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        let relations = ['user', 'roles', 'server'];
        if (res.locals.user.role === UserRole.ADMIN) {
            relations.push('messages', 'reactions');
        }
        return this.memberRepository.find({ where: { [server.id]: req.params.serverId }, relations: relations });
    }

    async one(req: Request, res: Response) {
        const server = await getRepository(Server).findOne({ where: { id: req.params.serverId } })
        if (!server.hasMember(res.locals.user.id) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        let relations = ['user', 'roles', 'server'];
        if (res.locals.user.role === UserRole.ADMIN) {
            relations.push('messages', 'reactions');
        }
        return this.memberRepository.findOne({
            where: { id: req.params.memberId, [server.id]: req.params.serverId },
            relations: relations
        });
    }

    async add(req: Request, res: Response) {
        const server = await getRepository(Server).findOne({ where: { id: req.params.serverId } })
        // TODO: Check if member have enough permissions to add member
        if (!server.hasMember(res.locals.user.id) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }

        let member = new Member();
        member.server = server;
        member.user = res.locals.user;
        return (await this.memberRepository.save(member))
    }

    async remove(req: Request, res: Response) {
        const server = await getRepository(Server).findOne({ where: { id: req.params.serverId } })
        // TODO: Check if member have enough permissions to remove member
        if (!server.hasMember(res.locals.user.id) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        let member = await this.one(req, res);
        return this.memberRepository.remove(member);
    }
}
