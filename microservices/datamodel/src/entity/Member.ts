import { Entity, ManyToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, BeforeRemove, getRepository } from "typeorm";
import { User, Role, Server, ServerType, Message, Reaction } from "./";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.members)
  user: User;

  @ManyToMany(type => Role, role => role.members)
  roles: Role[];

  @ManyToOne(type => Server, server => server.members)
  server: Server;

  @OneToMany(type => Message, message => message.author)
  messages: Message[];

  @ManyToMany(type => Reaction, reaction => reaction.members)
  reactions: Reaction[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeRemove()
  async deleteListener() {
    const member = await getRepository(Member).findOne(this.id, { relations: ['messages', 'reactions', 'server']});

    await getRepository(Message).remove(member.messages);
    await getRepository(Reaction).remove(member.reactions);
    if (member.server.type === ServerType.CONVERSATION && member.server.members.length === 1)
      await getRepository(Server).remove(member.server);
  }
}
