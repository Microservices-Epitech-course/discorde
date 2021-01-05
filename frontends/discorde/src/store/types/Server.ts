import { Member, Channel, Role, Invitation } from '.';

export enum ServerType {
  SERVER = 'server',
  CONVERSATION = 'conversation',
}

export interface Server {
  id: number;
  name: string;
  members: Member[];
  channels: Channel[];
  roles: Role[];
  invitations: Invitation[];
  type: ServerType;

  createdAt: Date;
  updatedAt: Date;
}
