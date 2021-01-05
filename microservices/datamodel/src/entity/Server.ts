import { Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, BeforeRemove, getRepository, Column } from "typeorm";
import { Member, Channel, Role, Invitation } from ".";

export enum ServerType {
  SERVER = "server",
  CONVERSATION = "conversation",
}

@Entity()
export class Server {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Member, member => member.server)
  members: Member[];

  @OneToMany(type => Channel, channel => channel.server)
  channels: Channel[];

  @OneToMany(type => Role, role => role.server)
  roles: Role[];

  @OneToMany(type => Invitation, invitation => invitation.server)
  invitations: Invitation[];

  @Column({ default: ServerType.SERVER })
  type: ServerType;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;


  @BeforeRemove()
  async deleteListener() {
    const server = await getRepository(Server).findOne(this.id, { relations: ['members', 'channels', 'roles', 'invitations'] });

    await getRepository(Member).remove(server.members);
    await getRepository(Channel).remove(server.channels);
    await getRepository(Role).remove(server.roles);
    await getRepository(Invitation).remove(server.invitations);
  }

  async hasUser(userId: number) {
    const server = await getRepository(Server).findOne(this.id, { relations: ['members', 'members.user'] });
    return server.members.findIndex(member => member.user.id === userId && !member.quit) !== -1;
  }
  hasMember(memberId: number) {
    return this.members.findIndex(member => member.id === memberId && !member.quit) !== -1;
  }
  async getUser(userId: number) {
    const server = await getRepository(Server).findOne(this.id, { relations: ['members', 'members.user'] });
    return server.members.find(member => member.user.id === userId && !member.quit);
  }
  async getMember(memberId: number) {
    const server = await getRepository(Server).findOne(this.id, { relations: ['members'] });
    return server.members.find(member => member.id === memberId && !member.quit);
  }
  async getEveryoneRole() {
    const server = await getRepository(Server).findOne(this.id, { relations: ['roles'] });
    return server.roles.find(role => role.isEveryone === true);
  }
}
