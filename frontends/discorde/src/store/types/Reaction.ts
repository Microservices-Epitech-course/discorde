import { Member, Message } from '.';

export interface Reaction {
  id: number;
  members: Member[];
  message: Message;
  reaction: string;

  createdAt: Date;
  updatedAt: Date;
}
