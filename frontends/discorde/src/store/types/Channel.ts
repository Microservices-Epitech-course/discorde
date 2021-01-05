import { ChannelRoleSettings, Message, Server } from '.';

export enum ChannelType {
  TEXTUAL = 'textual',
  VOCAL = 'vocal',
}

export interface Channel {
  id: number;
  name: string;
  type: ChannelType;

  channelRoleSettings: ChannelRoleSettings[];
  messages: Message[];
  server: Server;

  createdAt: Date;
  updatedAt: Date;
}
