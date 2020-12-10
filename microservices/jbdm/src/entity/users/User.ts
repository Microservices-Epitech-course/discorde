import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum UserGender {
  FEMALE = "female",
  MALE = "male",
  OTHER = "other",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  gender: UserGender;

  @Column({ nullable: true })
  age: number;
}
