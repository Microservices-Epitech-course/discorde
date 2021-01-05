import { User } from '.';

export enum RelationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  BLOCKED = 'blocked',
}

export enum RequestType {
  INCOMING = 'incoming',
  ONGOING = 'ongoing',
}

export interface Relation {
  id: number;
  userOneId: number;
  userTwoId: number;
  actionUserId: number;
  status: RelationStatus;
  users: User[];
  type?: RequestType;

  createdAt: Date;
  updatedAt: Date;
}
