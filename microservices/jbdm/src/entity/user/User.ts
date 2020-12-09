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

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  username: string;

  @Column()
  gender: UserGender;

  @Column()
  age: number;
}
