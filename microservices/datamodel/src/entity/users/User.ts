import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Relationship } from "./Relationship";

export enum UserGender {
  FEMALE = "female",
  MALE = "male",
  OTHER = "other",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  email: string;

  @Column({unique: true})
  username: string;

  @Column({ nullable: true })
  gender: UserGender;

  @Column({ nullable: true })
  age: number;

  @ManyToMany(type => Relationship, relation => relation.users)
  @JoinTable()
  relations: Relationship[];


  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
