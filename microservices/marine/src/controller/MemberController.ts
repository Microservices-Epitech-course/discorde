import { getRepository } from "typeorm";
import { Request } from "express";
import { Member, User } from "@discorde/datamodel";

export class MemberController {
    private memberRepository = getRepository(Member);

    async all(req: Request) {
        return this.memberRepository.find();
    }

    async one(req: Request) {
        return this.memberRepository.findOne({
            where: { id: req.params.memberId }
        });
    }

    async add(req: Request) {
        const user = await getRepository(User).findOne({ where: { id: req.body.userId } })
        return this.memberRepository.save({
            user: user
        })
    }

    async remove(req: Request) {
        let memberToRemove = await this.one(req);
        return this.memberRepository.remove(memberToRemove);
    }
}
