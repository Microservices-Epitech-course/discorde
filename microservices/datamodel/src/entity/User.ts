import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, BeforeRemove, getRepository, BeforeInsert, AfterUpdate } from "typeorm";
import { Member, Relation } from ".";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import jwtSecret from "../config/jwtSecret";
import { publisher } from "../config";

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

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true })
  gender: UserGender;

  @Column({ nullable: true })
  age: number;

  @Column({ default: "https://support.discord.com/hc/user_images/l12c7vKVRCd-XLIdDkLUDg.png" })
  image: string;

  @ManyToMany(type => Relation, relation => relation.users)
  @JoinTable()
  relations: Relation[];

  @OneToMany(type => Member, member => member.user)
  members: Member[];

  @Column({ default: UserStatus.OFFLINE })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async insertListener() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  @AfterUpdate()
  async updateListener() {
    publisher.publish(`userbc:${this.id}`, JSON.stringify({action: 'userUpdate', data: this}));
  }

  @BeforeRemove()
  async deleteListener() {
    const user = await getRepository(User).findOne(this.id, { relations: ['relations', 'members'] });

    publisher.publish(`userbc:${this.id}`, JSON.stringify({action: 'userDelete', data: this.id}));
    await getRepository(Relation).remove(user.relations);
    await getRepository(Member).remove(user.members);
  }

  checkPassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }

  getJWTToken() {
    return jwt.sign(
      { userId: this.id, username: this.username },
      jwtSecret,
      { expiresIn: "7d" },
    );
  }
}
