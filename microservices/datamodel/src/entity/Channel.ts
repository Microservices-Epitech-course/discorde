import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, BeforeRemove, getRepository } from "typeorm";
import { Server, ChannelRoleSettings, Message } from ".";

enum ChannelType {
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

  @BeforeRemove()
  async deleteListener() {
    const channel = await getRepository(Channel).findOne(this.id, {relations: ['channelRoleSettings', 'messages']});

    await getRepository(ChannelRoleSettings).remove(channel.channelRoleSettings);
    await getRepository(Message).remove(channel.messages);
  }
}
