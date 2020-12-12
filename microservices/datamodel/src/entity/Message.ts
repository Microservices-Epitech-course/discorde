import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { Member, Channel, Reaction, Conversation } from ".";

export enum MessageParent {
  SERVER = "server",
  CONVERSATION = "conversation",
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Member, member => member.messages)
  member: Member;

  @ManyToOne(type => Channel, channel => channel.messages, {nullable: true})
  channel: Channel;

  @ManyToOne(type => Conversation, conversation => conversation.messages, {nullable: true})
  conversation: Conversation;

  @Column()
  content: string;

  @Column({nullable: true})
  media: string;

  @OneToMany(type => Reaction, reaction => reaction.message)
  reactions: Reaction[];

  @Column()
  parent: MessageParent;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
