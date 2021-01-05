import { User } from '.';

export enum RelationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  BLOCKED = 'blocked',
}

export interface Relation {
  id: number;
  userOneId: number;
  userTwoId: number;
  actionUserId: number;
  status: RelationStatus;
  users: User[];

  createdAt: Date;
  updatedAt: Date;
}
