import { Role, Channel } from '.';

export enum ChannelRoleSettingsModifier {
  DENY = 'deny',
  DEFAULT = 'default',
  ALLOW = 'allow',
}

export interface ChannelRoleSettings {
  id: number;

  role: Role;
  channel: Channel;

  viewChannels: ChannelRoleSettingsModifier;
  manageChannels: ChannelRoleSettingsModifier;
  managePermissions: ChannelRoleSettingsModifier;
  sendMessages: ChannelRoleSettingsModifier;
  addReactions: ChannelRoleSettingsModifier;
  mentionRoles: ChannelRoleSettingsModifier;
  manageMessages: ChannelRoleSettingsModifier;

  createdAt: Date;
  updatedAt: Date;
}
