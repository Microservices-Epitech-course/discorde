import { Entity, ManyToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, JoinTable, BeforeRemove, getRepository } from "typeorm";
import { User, Message } from ".";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(type => User, user => user.conversations)
  @JoinTable()
  users: User[];

  @OneToMany(type => Message, message => message.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeRemove()
  async deleteListener() {
    const conversation = await getRepository(Conversation).findOne(this.id, {relations: ['messages']});

    await getRepository(Message).remove(conversation.messages);
  }
}
