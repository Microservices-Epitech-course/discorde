import { Entity, ManyToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, BeforeRemove, getRepository, Column } from "typeorm";
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

  @BeforeRemove()
  async deleteListener() {
    const member = await getRepository(Member).findOne(this.id, { relations: ['messages', 'reactions', 'server', 'server.members']});

    await getRepository(Message).remove(member.messages);
    await getRepository(Reaction).remove(member.reactions);
    if (member.server.type === ServerType.CONVERSATION && member.server.members.length === 1)
      await getRepository(Server).remove(member.server);
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
    const member = await getRepository(Member).findOne(channelId, { relations: ['roles', 'roles.channelRoleSettings', 'roles.channelRoleSettings.channel']});

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
