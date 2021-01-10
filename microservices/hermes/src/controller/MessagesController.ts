import { Channel, Message, publisher, UserRole } from "@discorde/datamodel";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as redis from "redis";

export class MessagesController {
  private messageRepository = getRepository(Message);
  private channelRepository = getRepository(Channel);

  async findChannel(req: Request, res: Response) {
    try {
      const userRequestId = res.locals.jwtPayload.userId;
      const channel = await this.channelRepository.findOneOrFail(req.params.id, { relations: ["messages", "messages.author", "server"]});
      const server = channel.server;
      const member = await server.getUser(userRequestId);
      if (!member && res.locals.user.role !== UserRole.ADMIN) {
        res.status(404).send();
        return null;
      }
      if (res.locals.user.role !== UserRole.ADMIN && !(await member.hasChannelPermission("viewChannels", channel.id))) {
        res.status(404).send();
        return null;
      }
      return {channel, member};
    } catch (e) {
      res.status(404).send();
      return null;
    }
  }

  async get(req: Request, res: Response) {
    try {
      const result = await this.findChannel(req, res);

      if (result === null)
        return;

      const { channel } = result;

      if (!channel)
        return;
      return channel.messages;
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async post(req: Request, res: Response) {
    try {
      const {channel, member} = await this.findChannel(req, res);

      if (!channel)
        return;
      if (!(await member.hasChannelPermission("sendMessages", channel.id))) {
        res.status(404).send();
        return;
      }
      // TODO: Add media / mentions / ?
      const { content } = req.body;
      const message = this.messageRepository.create({
        author: member,
        channel: channel,
        content: content,
        media: null,
      });
      channel.messages.push(message);
      await this.channelRepository.save(channel);
      await this.messageRepository.save(message);

      const sendMessage = await this.messageRepository.findOne(message.id, { relations: ["author"]});
      return sendMessage;
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async patch(req: Request, res: Response) {
    try {
      const {channel, member} = await this.findChannel(req, res);

      if (!channel)
        return;
      const messageId = Number(req.params.messageId);
      const message = channel.messages.find((message) => message.id === messageId);
      if (!message) {
        res.status(404).send();
        return;
      }
      if (message.author.id !== member.id && res.locals.user.role !== UserRole.ADMIN) {
        if (!(await member.hasChannelPermission("manageMessages", channel.id))) {
          res.status(404).send();
          return;
        }
      }
      // TODO: Add media / mentions / ?
      const { content } = req.body;
      message.content = content;
      await this.messageRepository.save(message);

      const sendMessage = await this.messageRepository.findOne(message.id, { relations: ["author"]});
      return sendMessage;
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const {channel, member} = await this.findChannel(req, res);

      if (!channel)
        return;
      const messageId = Number(req.params.messageId);
      const message = channel.messages.find((message) => message.id === messageId);
      if (!message) {
        res.status(404).send();
        return;
      }
      if (message.author.id !== member.id && res.locals.user.role !== UserRole.ADMIN) {
        if (!(await member.hasChannelPermission("manageMessages", channel.id))) {
          res.status(404).send();
          return;
        }
      }
      return this.messageRepository.remove(message);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}