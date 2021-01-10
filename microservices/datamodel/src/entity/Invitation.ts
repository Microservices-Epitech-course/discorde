import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Server } from ".";

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  url: string;

  @ManyToOne(type => Server, server => server.invitations)
  server: Server;

  @Column()
  expirationDate: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
