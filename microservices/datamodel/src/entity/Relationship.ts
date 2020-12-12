import { Entity, Column, Unique, Check, ManyToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from ".";

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
  @PrimaryGeneratedColumn()
  id: number;

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
