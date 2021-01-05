import { Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Role, Channel } from ".";

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


  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
