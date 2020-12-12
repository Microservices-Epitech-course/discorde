import { Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Role, Channel } from ".";

@Entity()
export class ChannelRoleSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Role, role => role.channelRoleSettings)
  role: Role;

  @ManyToOne(type => Channel, channel => channel.channelRoleSettings)
  channel: Channel;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
