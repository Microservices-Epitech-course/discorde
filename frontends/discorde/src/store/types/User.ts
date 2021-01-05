import { Relation, Member } from '.';

export enum UserGender {
  FEMALE = 'female',
  MALE = 'male',
  OTHER = 'other',
}

export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  IDLE = 'idle',
  OCCUPIED = 'occupied',
  INVISIBLE = 'invisible',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  role: UserRole;
  gender: UserGender;
  age: number;
  image: string;

  relations: Relation[];
  members: Member[];
  status: UserStatus;

  createdAt: Date;
  updatedAt: Date;
}
