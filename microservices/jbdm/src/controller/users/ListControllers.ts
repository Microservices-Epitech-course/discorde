import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Member, ServerType, UserRole } from "@discorde/datamodel";

export class ListController {
  private memberRepository = getRepository(Member);

  async conversations(req: Request, res: Response) {
    try {
      if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
        res.status(401).send("Cant get someone else conversations");
        return;
      }
      const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;

      const members = await this.memberRepository.find({
        where: {
          user: {
            id: userId
          },
          quit: false,
        },
        relations: ["server", "server.members", "server.members.user", "server.channels", "server.roles", "server.roles.members"]
      });
      const filtered = members.filter((e) => e.server.type === ServerType.CONVERSATION);
      const servers = await Promise.all(filtered
        .map(async (member) => {
          const filteredChannels = await Promise.all(member.server.channels.filter(async (c) => {
            await member.hasChannelPermission("viewChannels", c.id);
          }));
          member.server.channels = filteredChannels;
          return member.server;
        })
      );
      return servers;
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async servers(req: Request, res: Response) {
    try {
      if (req.params.userId !== "@me" && res.locals.user.role !== UserRole.ADMIN) {
        res.status(401).send("Cant get someone else servers");
        return;
      }
      const userId = req.params.userId === "@me" ? res.locals.user.id : req.params.userId;

      const members = await this.memberRepository.find({
        where: {
          user: {
            id: userId
          },
          quit: false,
        },
        relations: ["server", "server.members", "server.members.user", "server.channels", "server.roles", "server.roles.members"]
      });
      const filtered = members.filter((e) => e.server.type === ServerType.SERVER)
      const servers = await Promise.all(filtered
        .map(async (member) => {
          const filteredChannels = await Promise.all(member.server.channels.filter(async (c) => {
            await member.hasChannelPermission("viewChannels", c.id);
          }));
          member.server.channels = filteredChannels;
          return member.server;
        })
      );
      return servers;
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}