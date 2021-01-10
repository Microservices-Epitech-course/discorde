import { Entity, Column, Unique, Check, ManyToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, AfterInsert, getRepository, JoinTable, AfterUpdate, BeforeRemove } from "typeorm";
import { User } from ".";
import { publisher } from "../config";

export enum RelationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  BLOCKED = "blocked",
}

@Entity()
@Unique(["userOneId", "userTwoId"])
@Check(`"userOneId" < "userTwoId"`)
@Check(`"actionUserId" = "userOneId" OR "actionUserId" = "userTwoId"`)
export class Relation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userOneId: number;

  @Column()
  userTwoId: number;

  @Column()
  actionUserId: number;

  @Column()
  status: RelationStatus;

  @ManyToMany(type => User, user => user.relations)
  users: User[];

  @AfterInsert()
  async insertListener() {
    const relation = {...this};
    publisher.publish(`user:${this.userOneId}`, JSON.stringify({ action: "relationAdd", data: relation}));
    publisher.publish(`user:${this.userTwoId}`, JSON.stringify({ action: "relationAdd", data: relation}));
  }

  @AfterUpdate()
  async updateListener() {
    const relation = await getRepository(Relation).findOne(this.id, { relations: ["users"]});
    publisher.publish(`user:${this.userOneId}`, JSON.stringify({ action: "relationUpdate", data: relation}));
    publisher.publish(`user:${this.userTwoId}`, JSON.stringify({ action: "relationUpdate", data: relation}));
    if (this.status === RelationStatus.ACCEPTED) {
      publisher.publish(`user:${this.userOneId}`, JSON.stringify({ action: "friendAdd", data: relation.users.find((e) => e.id === this.userTwoId)}));
      publisher.publish(`user:${this.userTwoId}`, JSON.stringify({ action: "friendAdd", data: relation.users.find((e) => e.id === this.userOneId)}));
    }
  }

  @BeforeRemove()
  async deleteListener() {
    publisher.publish(`user:${this.userOneId}`, JSON.stringify({ action: "relationDelete", data: this.id}));
    publisher.publish(`user:${this.userTwoId}`, JSON.stringify({ action: "relationDelete", data: this.id}));
  }

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
