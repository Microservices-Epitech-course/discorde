import { Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne, Column, AfterInsert, BeforeRemove, getRepository, AfterUpdate } from "typeorm";
import { Role, Channel } from ".";
import { publisher } from "../config";

export enum ChannelRoleSettingsModifier {
  DENY = "deny",
  DEFAULT = "default",
  ALLOW = "allow"
}

@Entity()
export class ChannelRoleSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Role, role => role.channelRoleSettings)
  role: Role;

  @ManyToOne(type => Channel, channel => channel.channelRoleSettings)
  channel: Channel;

  @Column({default: ChannelRoleSettingsModifier.DEFAULT})
  viewChannels: ChannelRoleSettingsModifier;
  @Column({default: ChannelRoleSettingsModifier.DEFAULT})
  manageChannels: ChannelRoleSettingsModifier;
  @Column({default: ChannelRoleSettingsModifier.DEFAULT})
  managePermissions: ChannelRoleSettingsModifier;
  @Column({default: ChannelRoleSettingsModifier.DEFAULT})
  sendMessages: ChannelRoleSettingsModifier;
  @Column({default: ChannelRoleSettingsModifier.DEFAULT})
  addReactions: ChannelRoleSettingsModifier;
  @Column({default: ChannelRoleSettingsModifier.DEFAULT})
  mentionRoles: ChannelRoleSettingsModifier;
  @Column({default: ChannelRoleSettingsModifier.DEFAULT})
  manageMessages: ChannelRoleSettingsModifier;
  // embedLinks
  // attachFiles
  //// createInvite
  //// useExternalEmoji
  //// readMessageHistory
  //// sendTTS

  @AfterInsert()
  async insertListener() {
    const channelRole = await getRepository(ChannelRoleSettings).findOne(this.id, { relations: ['channel'] });
    const channelRoleSend = await getRepository(ChannelRoleSettings).findOne(this.id, { relations: ['role'] });

    publisher.publish(`channel:${channelRole.channel.id}`, JSON.stringify({action: "channelRoleAdd", data: channelRoleSend}));
  }

  @AfterUpdate()
  async updateListener() {
    const channelRole = await getRepository(ChannelRoleSettings).findOne(this.id, { relations: ['channel'] });
    const channelRoleSend = await getRepository(ChannelRoleSettings).findOne(this.id, { relations: ['role'] });

    publisher.publish(`channel:${channelRole.channel.id}`, JSON.stringify({action: "channelRoleUpdate", data: channelRoleSend}));
  }

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
