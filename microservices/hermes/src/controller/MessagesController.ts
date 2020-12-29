import { Channel, Message } from "@discorde/datamodel";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as redis from "redis";

export class MessagesController {
  private messageRepository = getRepository(Message);
  private channelRepository = getRepository(Channel);
  private publisher = redis.createClient();

  async findChannel(req: Request, res: Response) {
    try {
      const userRequestId = res.locals.jwtPayload.userId;
      const channel = await this.channelRepository.findOneOrFail(req.params.id, { relations: ["messages", "messages.author", "channelRoleSettings", "channelRoleSettings.role", "server", "server.members", "server.members.user"]});
      if (channel.server.members.findIndex((member) => member.user.id === userRequestId) === -1) {
        res.status(404).send();
        return null;
      }
      const member = channel.server.members.find((member) => member.user.id === res.locals.user.id);
      return [channel, member];
    } catch (e) {
      res.status(404).send();
      return null;
    }
  }

  async get(req: Request, res: Response) {
    const [channel, _] = await this.findChannel(req, res);

    if (!channel)
      return;
    return channel.messages;
  }

  async post(req: Request, res: Response) {
    const [channel, member] = await this.findChannel(req, res);

    if (!channel)
      return;
    // TODO: Add media / mentions / ?
    const { content } = req.body;
    const message = this.messageRepository.create({
      author: member,
      channel: channel,
      content: content,
      media: null,
    });
    channel.messages.push(message);
    this.messageRepository.save(message);
    this.channelRepository.save(channel);
    this.publisher.publish(`channel:${channel.id}`, JSON.stringify({action: "messageAdd", data: message}));
    res.status(200).send();
  }

  async patch(req: Request, res: Response) {
    const [channel, member] = await this.findChannel(req, res);

    if (!channel)
      return;
    const messageId = Number(req.params.messageId);
    const message = channel.messages.find((message) => message.id === messageId);
    if (!message || message.author.id !== member.id) {
      res.status(404).send();
      return;
    }
    // TODO: Add media / mentions / ?
    const { content } = req.body;
    message.content = content;
    this.messageRepository.save(message);
    this.publisher.publish(`channel:${channel.id}`, JSON.stringify({action: "messageUpdate", data: message}));
    res.status(200).send();
  }

  async delete(req: Request, res: Response) {
    const [channel, member] = await this.findChannel(req, res);

    if (!channel)
      return;
    const messageId = Number(req.params.messageId);
    const message = channel.messages.find((message) => message.id === messageId);
    if (!message || message.author.id !== member.id) {
      res.status(404).send();
      return;
    }
    this.messageRepository.remove(message);
    this.publisher.publish(`channel:${channel.id}`, JSON.stringify({action: "messageDelete", data: messageId}));
    res.status(200).send();
  }
}