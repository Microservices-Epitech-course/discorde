import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Member, Role, Server, User, UserRole } from "@discorde/datamodel";

export class MemberController {
    private memberRepository = getRepository(Member);
    private serverRepository = getRepository(Server);

    private async findServer(res: Response, serverId: any) {
        try {
          return await this.serverRepository.findOneOrFail({ where: { id: serverId } });
        } catch (e) {
          res.status(404).send(`Server ${serverId} doesnt exist`);
          return null;
        }
    }
    private async findMember(res: Response, memberId: any, serverId: any, relations?: any) {
        try {
          return await this.memberRepository.findOneOrFail({ where: { id: memberId, server: { id: serverId }, quit: false}, relations});
        } catch (e) {
          res.status(404).send(`Member ${memberId} doesnt exists on Server ${serverId}`);
          return null;
        }
    }
    private async findMemberUser(res: Response, userId: any, serverId: any, relations?: any) {
        try {
          return await this.memberRepository.findOneOrFail({ where: { user: { id: userId}, server: { id: serverId }, quit: false}, relations});
        } catch (e) {
          res.status(404).send(`Member ${userId} doesnt exists on Server ${serverId}`);
          return null;
        }
    }
    private async findUser(res: Response, userId: any) {
        try {
          return await getRepository(User).findOneOrFail({ where: { id: userId }});
        } catch (e) {
          res.status(404).send(`User ${userId} doesnt exists`);
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
        let relations = ['user', 'roles', 'server'];
        if (res.locals.user.role === UserRole.ADMIN) {
            relations.push('messages', 'reactions');
        }
        return this.memberRepository.find({ where: { server: {id: req.params.serverId }, quit: false}, relations: relations });
    }

    async one(req: Request, res: Response) {
        const server = await this.findServer(res, req.params.serverId);
        if (!server)
            return;
        if (!(await server.hasUser(res.locals.user.id)) && res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        let relations = ['user', 'roles', 'server'];
        if (res.locals.user.role === UserRole.ADMIN) {
            relations.push('messages', 'reactions');
        }
        return this.findMember(res, req.params.memberId, req.params.serverId, relations);
    }

    async add(req: Request, res: Response) {
        const server = await this.findServer(res, req.params.serverId);
        if (!server)
            return;
        if ((await server.hasUser(Number(req.params.userId))) || res.locals.user.role !== UserRole.ADMIN) {
            res.status(404).send();
            return;
        }
        const user = await this.findUser(res, req.params.userId);
        if (!user)
            return;

        const existList = await this.memberRepository.find({where: {user: {id: user.id }, server: {id: server.id }}, relations: ["user"]});
        if (existList.length !== 0) {
            const exist = existList[0];
            exist.quit = false;
            const serverSend = await this.serverRepository.findOne(server.id, {
                relations: ["members", "members.user", "channels", "roles", "roles.members"]
            });
            return serverSend;
        }

        let member = new Member();
        member.server = server;
        member.user = user;
        member.roles = [await server.getEveryoneRole()]
        return this.memberRepository.save(member);
    }

    async remove(req: Request, res: Response) {
        const server = await this.findServer(res, req.params.serverId);
        if (!server)
            return;
        const userId = Number(req.params.memberId === "@me" ? res.locals.user.id : req.params.memberId);
        if (!(await server[req.params.memberId === "@me" ? "hasUser" : "hasMember"](userId, true))) {
            res.status(404).send("User not found on server");
            return;
        }
        if (req.params.memberId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
            const callerMember = await server.getUser(res.locals.user.id);
            if (!callerMember || !(await callerMember.hasGlobalPermission("kickMembers"))) {
                res.status(404).send();
                return;
            }
        }
        const member = await this[req.params.memberId === "@me" ? "findMemberUser" : "findMember"](res, userId, req.params.serverId, ["user"]);
        if (!member)
            return;
        if (member.owner) {
            res.status(404).send("Owner cant quit its own server");
            return;
        }
        // TODO: Delete server if nobody on it
        // if (req.body.clear) {
            // return this.memberRepository.remove(member);
        // } else {
        member.quit = true;
        return await this.memberRepository.save(member);
    }

    async changeRole(req: Request, res: Response) {
        const { rolesId } = req.body;
        if (!rolesId) {
            res.status(404).send("Missing rolesId parameter");
            return
        }
        const server = await this.findServer(res, req.params.serverId);
        if (!server)
            return;
        const member = await server.getMember(Number(req.params.memberId));
        if (!member) {
            res.status(404).send();
            return;
        }
        if (res.locals.user.role !== UserRole.ADMIN) {
            const callerMember = await server.getMember(Number(req.params.memberId));
            if (!(await callerMember.hasGlobalPermission("manageRoles"))) {
                res.status(404).send();
                return;
            }
        }
        const roles = await getRepository(Role).find({where: rolesId.map(roleId => ({id: roleId}))});
        member.roles = roles;
        return this.memberRepository.save(member);
    }
}
