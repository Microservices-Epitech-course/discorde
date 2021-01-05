import { Server } from '.';

export interface Invitation {
  id: number;
  url: string;
  expirationDate: Date;

  server: Server;

  createdAt: Date;
  updatedAt: Date;
}
