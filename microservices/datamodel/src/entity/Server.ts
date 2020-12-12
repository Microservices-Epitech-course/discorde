import { Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, BeforeRemove, getRepository } from "typeorm";
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


  @BeforeRemove()
  async deleteListener() {
    const server = await getRepository(Server).findOne(this.id, { relations: ['members', 'channels', 'roles', 'invitations']});

    await getRepository(Member).remove(server.members);
    await getRepository(Channel).remove(server.channels);
    await getRepository(Role).remove(server.roles);
    await getRepository(Invitation).remove(server.invitations);
  }
}
