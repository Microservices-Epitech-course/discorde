import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Relationship, Conversation, Member } from ".";

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

  @Column({unique: true})
  email: string;

  @Column({unique: true})
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  gender: UserGender;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  image: string;

  @ManyToMany(type => Relationship, relation => relation.users)
  @JoinTable()
  relations: Relationship[];

  @OneToMany(type => Member, member => member.user)
  serverMembers: Member[];

  @ManyToMany(type => Conversation, conversation => conversation.users)
  @JoinTable()
  conversations: Conversation[];

  @Column()
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
