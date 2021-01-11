import { Entity, ManyToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, BeforeRemove, getRepository, Column, AfterInsert, AfterUpdate } from "typeorm";
import { publisher } from "../config";
import { User, Role, Server, ServerType, Message, Reaction } from "./";
import { ChannelRoleSettingsModifier } from "./ChannelRoleSettings";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.members)
  user: User;

  @ManyToMany(type => Role, role => role.members)
  roles: Role[];

  @ManyToOne(type => Server, server => server.members)
  server: Server;

  @OneToMany(type => Message, message => message.author)
  messages: Message[];

  @ManyToMany(type => Reaction, reaction => reaction.members)
  reactions: Reaction[];

  @Column({default: false})
  owner: boolean;

  @Column({default: false})
  quit: boolean;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @AfterInsert()
  async insertListener() {
    const member = {...this};
    delete member.roles;
    delete member.server;
    delete member.messages;
    delete member.reactions;
    if (this.server) {
      const server = await getRepository(Server).findOne(this.server.id, { relations: ["members", "members.user", "channels", "roles", "roles.members"]});
      server.members.push(member);
      publisher.publish(`user:${this.user.id}`, JSON.stringify({ action: `${this.server.type === ServerType.CONVERSATION ? "conversation" : "server"}Add`, data: server }))
      publisher.publish(`server:${this.server.id}`, JSON.stringify({ action: "memberAdd", data: member }))
    }
  }

  @AfterUpdate()
  async updateListener() {
    const memberTmp = await getRepository(Member).findOne(this.id, { relations: ['server']});
    const member = await getRepository(Member).findOne(this.id, { relations: ['user']});
    if (this.quit === true) {
      publisher.publish(`server:${memberTmp.server.id}`, JSON.stringify({ action: "memberDelete", data: this.id}));
      publisher.publish(`user:${member.user.id}`, JSON.stringify({ action: `${memberTmp.server.type === ServerType.CONVERSATION ? "conversation" : "server"}Delete`, data: memberTmp.server.id}));
    } else {
      publisher.publish(`server:${memberTmp.server.id}`, JSON.stringify({ action: "memberUpdate", data: member }))
    }
  }

  @BeforeRemove()
  async deleteListener() {
    const member = await getRepository(Member).findOne(this.id, { relations: ['messages', 'reactions', 'server', 'server.members', 'user']});

    publisher.publish(`server:${member.server.id}`, JSON.stringify({ action: "memberDelete", data: this.id}));
    publisher.publish(`user:${member.user.id}`, JSON.stringify({ action: `${member.server.type === ServerType.CONVERSATION ? "conversation" : "server"}Delete`, data: member.server.id}));
    await getRepository(Message).remove(member.messages);
    await getRepository(Reaction).remove(member.reactions);
    // TODO In api functions instead of here
    // if (member.server.type === ServerType.CONVERSATION && member.server.members.length === 1)
    //   await getRepository(Server).remove(member.server);
  }

  async isAdmin() {
    const member = await getRepository(Member).findOne(this.id, { relations: ['roles']});
    if (member.owner)
      return true;
    return member.roles.reduce((acc, e) => {
      if (e.administrator)
        acc = true;
      return acc;
    }, false);
  }
  async hasGlobalPermission(permission: string) {
    const member = await getRepository(Member).findOne(this.id, { relations: ['roles']});
    if (await member.isAdmin())
      return true;
    return member.roles.reduce((acc, e) => {
      if (e[permission])
        acc = true;
      return acc;
    }, false);
  }
  async hasChannelPermission(permission: string, channelId: number) {
    const globalPerm = await this.hasGlobalPermission(permission);
    const member = await getRepository(Member).findOne(this.id, { relations: ['roles', 'roles.channelRoleSettings', 'roles.channelRoleSettings.channel']});

    if (await member.isAdmin())
      return true;

    const channelRoleSettings = member.roles.map(role => ({...role, channelRoleSettings: role.channelRoleSettings.filter(channelRole => channelRole.channel.id === channelId)}));
    const channelPerm = channelRoleSettings.reduce((acc, e) => {
      if (acc === 1)
        return acc;
      let value = 0;
      if (e.channelRoleSettings.length === 1 && e.channelRoleSettings[0][permission] !== ChannelRoleSettingsModifier.DEFAULT) {
        if (e.channelRoleSettings[0][permission] === ChannelRoleSettingsModifier.ALLOW)
          value = 1;
        else
          value = -1;
      }
      if (value > acc)
        return value;
      return acc;
    }, 0);
    if ((globalPerm && channelPerm === -1) || (!globalPerm && channelPerm <= 0))
      return false;
    else if ((globalPerm && channelPerm >= 0) || (!globalPerm && channelPerm === 1))
      return true;
    return false;
  }
}
