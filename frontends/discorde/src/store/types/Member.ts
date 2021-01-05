import { User, Role, Server, Message, Reaction } from '.';

export interface Member {
  id: number;
  user: User;
  roles: Role[];
  server: Server;
  messages: Message[];
  reactions: Reaction[];
  owner: boolean;
  quit: boolean;

  createdAt: Date;
  updatedAt: Date;
}
