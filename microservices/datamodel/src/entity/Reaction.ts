import { Entity, Column, ManyToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne, JoinTable, AfterInsert, getRepository, AfterUpdate } from "typeorm";
import { Member, Message } from ".";
import { publisher } from "../config";

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(type => Member, member => member.reactions)
  @JoinTable()
  members: Member[];

  @ManyToOne(type => Message, message => message.reactions)
  message: Message;

  @Column()
  reaction: string;

  @AfterInsert()
  async insertListener() {
    const reaction = await getRepository(Reaction).findOne(this.id, { relations: ["members", "message"]});
    publisher.publish(`channel:${this.message.channel.id}`, JSON.stringify({ action: "reactionAdd", data: reaction}));
  }

  @AfterUpdate()
  async updateListener() {
    const reaction = await getRepository(Reaction).findOne(this.id, { relations: ["members", "message"]});
    publisher.publish(`channel:${this.message.channel.id}`, JSON.stringify({ action: "reactionUpdate", data: reaction}));
  }

  @AfterInsert()
  async deleteListener() {
    const reaction = await getRepository(Reaction).findOne(this.id, { relations: ["members", "message"]});
    publisher.publish(`channel:${this.message.channel.id}`, JSON.stringify({ action: "reactionDelete", data: this.id}));
  }

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
