import { Entity, Column, Unique, Check, ManyToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

export enum RelationshipStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  BLOCKED = "blocked",
}

@Entity()
@Unique(["userOneId", "userTwoId"])
@Check(`"userOneId" < "userTwoId"`)
@Check(`"actionUserId" = "userOneId" OR "actionUserId" = "userTwoId"`)
export class Relationship {
  @Column({ primary: true })
  userOneId: number;

  @Column({ primary: true })
  userTwoId: number;

  @Column()
  actionUserId: number;

  @Column()
  status: RelationshipStatus;

  @ManyToMany(type => User, user => user.relations)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
