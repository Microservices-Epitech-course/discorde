import { Member, Channel, Reaction } from '.';

export interface Message {
  id: number;
  author: Member;
  channel: Channel;
  content: string;
  media: string;
  reactions: Reaction[];

  createdAt: Date;
  updatedAt: Date;
}
