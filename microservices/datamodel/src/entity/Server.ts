import { Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Member, Channel, Role, Invitation } from ".";

@Entity()
export class Server {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(type => Member, member => member.server)
  members: Member[];

  @OneToMany(type => Channel, channel => channel.server)
  channels: Channel[];

  @OneToMany(type => Role, role => role.server)
  roles: Role[];

  @OneToMany(type => Invitation, invitation => invitation.server)
  invitations: Invitation[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
