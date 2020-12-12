import { Entity, Column, ManyToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne, JoinTable } from "typeorm";
import { Member, Message } from ".";

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

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
