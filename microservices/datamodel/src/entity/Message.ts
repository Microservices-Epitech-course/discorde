import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, BeforeRemove, getRepository } from "typeorm";
import { Member, Channel, Reaction } from ".";

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

  @BeforeRemove()
  async deleteListener() {
    const message = await getRepository(Message).findOne(this.id, {relations: ['reactions']});

    await getRepository(Reaction).remove(message.reactions);
  }
}
