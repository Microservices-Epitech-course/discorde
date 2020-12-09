import { Entity, PrimaryColumn, Column, ManyToOne, Unique, Check } from "typeorm";
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
@Check(`"actionUserId" == "userOneId" OR "actionUserId" == "userTwoId"`)
export class Relationship {
  @PrimaryColumn({ name: "user_one_id" })
  @ManyToOne(() => User, (user) => user.id)
  userOneId: number;

  @PrimaryColumn({ name: "user_two_id" })
  @ManyToOne(() => User, (user) => user.id)
  userTwoId: number;

  @Column()
  status: RelationshipStatus;

  @Column({ name: "action_user_id" })
  @ManyToOne(() => User, (user) => user.id)
  actionUserId: number;
}
