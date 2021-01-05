import { Member, Server, ChannelRoleSettings } from '.';

export interface Role {
  id: number;
  name: string;
  members: Member[];
  server: Server;
  channelRoleSettings: ChannelRoleSettings[];
  color: string;
  isEveryone: boolean;

  viewChannels: boolean;
  viewSeparately: boolean;
  allowMention: boolean;
  manageChannels: boolean;
  manageRoles: boolean;
  manageServer: boolean;
  createInvite: boolean;
  changeNickname: boolean;
  manageNickname: boolean;
  kickMembers: boolean;
  banMembers: boolean;
  sendMessages: boolean;
  addReactions: boolean;
  mentionRoles: boolean;
  manageMessages: boolean;
  administrator: boolean;

  createdAt: Date;
  updatedAt: Date;
}
