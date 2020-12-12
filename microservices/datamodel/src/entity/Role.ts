import { Entity, Column, ManyToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinTable } from "typeorm";
import { Member, Server, ChannelRoleSettings } from ".";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(type => Member, member => member.roles)
  @JoinTable()
  members: Member[];

  @ManyToOne(type => Server, server => server.roles)
  server: Server;

  @OneToMany(type => ChannelRoleSettings, channelRoleSettings => channelRoleSettings.role)
  channelRoleSettings: ChannelRoleSettings[];

  @Column()
  color: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
