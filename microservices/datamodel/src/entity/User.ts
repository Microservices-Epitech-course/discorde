import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, BeforeRemove, getRepository, getConnection } from "typeorm";
import { Conversation, Member, Relation } from ".";

export enum UserGender {
  FEMALE = "female",
  MALE = "male",
  OTHER = "other",
}

export enum UserStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  IDLE = "idle",
  OCCUPIED = "occupied",
  INVISIBLE = "invisible",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  gender: UserGender;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  image: string;

  @ManyToMany(type => Relation, relation => relation.users)
  @JoinTable()
  relations: Relation[];

  @OneToMany(type => Member, member => member.user)
  serverMembers: Member[];

  @ManyToMany(type => Conversation, conversation => conversation.users)
  conversations: Conversation[];

  @Column()
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeRemove()
  async deleteListener() {
    const user = await getRepository(User).findOne(this.id, { relations: ['relations', 'serverMembers', 'conversations'] });

    await getRepository(Relation).remove(user.relations);
    await getRepository(Member).remove(user.serverMembers);

    const conversations = (await getRepository(Conversation).findByIds(user.conversations, { relations: ['users'] })).map((conversation) => { conversation.users = conversation.users.filter((e) => e.id !== user.id); return conversation; });
    await getRepository(Conversation).save(conversations);
    await getRepository(Conversation).remove(conversations.filter((conversation) => conversation.users.length < 2));
  }
}
