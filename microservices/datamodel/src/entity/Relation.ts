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
    const relation = getRepository(Relation).findOne(this.id, { relations: ["users"]});
    publisher.publish(`user:${this.userOneId}`, JSON.stringify({ action: "relationAdd", data: relation}));
    publisher.publish(`user:${this.userTwoId}`, JSON.stringify({ action: "relationAdd", data: relation}));
  }

  @AfterUpdate()
  async updateListener() {
    const relation = getRepository(Relation).findOne(this.id, { relations: ["users"]});
    publisher.publish(`user:${this.userOneId}`, JSON.stringify({ action: "relationUpdate", data: relation}));
    publisher.publish(`user:${this.userTwoId}`, JSON.stringify({ action: "relationUpdate", data: relation}));
  }

  @BeforeRemove()
  async deleteListener() {
    const relation = getRepository(Relation).findOne(this.id, { relations: ["users"]});
    publisher.publish(`user:${this.userOneId}`, JSON.stringify({ action: "relationDelete", data: this.id}));
    publisher.publish(`user:${this.userTwoId}`, JSON.stringify({ action: "relationDelete", data: this.id}));
  }

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
