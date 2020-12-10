import { Entity, Column, RelationId, Unique, Check } from "typeorm";
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
}
