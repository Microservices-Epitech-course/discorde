import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, BeforeRemove, getRepository, AfterInsert, AfterUpdate } from "typeorm";
import { Member, Channel, Reaction } from ".";
import { publisher } from "../config";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Member, member => member.messages)
  author: Member;

  @ManyToOne(type => Channel, channel => channel.messages, {nullable: true})
  channel: Channel;

  @Column()
  content: string;

  @Column({nullable: true})
  media: string;

  @OneToMany(type => Reaction, reaction => reaction.message)
  reactions: Reaction[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @AfterInsert()
  async insertListener() {
    const message = {
      ...this,
    };
    delete message.channel;
    delete message.author.user;
    publisher.publish(`channel:${this.channel.id}`, JSON.stringify({ action: "messageAdd", data: message }));
  }

  @AfterUpdate()
  async updateListener() {
    const message = await getRepository(Message).findOne(this.id, { relations: ['author', 'reactions']});
    publisher.publish(`channel:${this.channel.id}`, JSON.stringify({ action: "messageUpdate", data: message }));
  }

  @BeforeRemove()
  async deleteListener() {
    const message = await getRepository(Message).findOne(this.id, {relations: ['reactions']});

    publisher.publish(`channel:${this.channel.id}`, JSON.stringify({ action: "messageDelete", data: this.id }));
    await getRepository(Reaction).remove(message.reactions);
  }
}
