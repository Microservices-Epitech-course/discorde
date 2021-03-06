import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, BeforeRemove, getRepository, AfterInsert, AfterUpdate } from "typeorm";
import { Server, ChannelRoleSettings, Message } from ".";
import { publisher } from "../config/redis";

export enum ChannelType {
  TEXTUAL = "textual",
  VOCAL = "vocal"
}

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: ChannelType;

  @OneToMany(type => ChannelRoleSettings, channelRoleSettings => channelRoleSettings.channel)
  channelRoleSettings: ChannelRoleSettings[];

  @OneToMany(type => Message, message => message.channel)
  messages: Message[];

  @ManyToOne(type => Server, server => server.channels)
  server: Server;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @AfterInsert()
  async insertListener() {
    const channel = { ...this };
    delete channel.channelRoleSettings;
    delete channel.messages;
    delete channel.server;
    if (this.server)
      publisher.publish(`server:${this.server.id}`, JSON.stringify({action: "channelAdd", data: channel}));
  }

  @AfterUpdate()
  async updateListener() {
    publisher.publish(`server:${this.id}`, JSON.stringify({action: "channelUpdate", data: this}));
  }

  @BeforeRemove()
  async deleteListener() {
    const channel = await getRepository(Channel).findOne(this.id, { relations: ['channelRoleSettings', 'messages', 'server'] });

    publisher.publish(`server:${this.id}`, JSON.stringify({ action: "channelDelete", data: channel.id }));
    await getRepository(ChannelRoleSettings).remove(channel.channelRoleSettings);
    await getRepository(Message).remove(channel.messages);
  }
}
