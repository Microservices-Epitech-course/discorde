import { Member, Channel, Reaction } from '.';

export interface Message {
  id: number;
  author?: Member;
  authorId?: number;
  channel: Channel;
  content: string;
  media: string;
  reactions: Reaction[];

  createdAt: Date;
  updatedAt: Date;
}
