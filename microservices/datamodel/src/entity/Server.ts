import { Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, BeforeRemove, getRepository, Column, AfterInsert, AfterUpdate } from "typeorm";
import { Member, Channel, Role, Invitation } from ".";
import { publisher } from "../config";

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

  @AfterInsert()
  async insertListener() {
    const server = {...this};
    this.members.forEach((e) => {
      publisher.publish(`user:${e.user.id}`, JSON.stringify({action: `${this.type === ServerType.SERVER ? "server" : "conversation"}Add`, data: server}));
    });
  }

  @AfterUpdate()
  async updateListener() {
    const server = await getRepository(Server).findOne(this.id, { relations: ["members", "members.user", "channels", "roles", "roles.members"]});
    publisher.publish(`server:${this.id}`, JSON.stringify({action: "serverUpdate", data: server}));
  }

  @BeforeRemove()
  async deleteListener() {
    const server = await getRepository(Server).findOne(this.id, { relations: ['members', 'channels', 'roles', 'invitations'] });

    publisher.publish(`server:${this.id}`, JSON.stringify({action: `${this.type === ServerType.CONVERSATION ? "conversation" : "server"}Delete`, data: this.id}));
    await getRepository(Member).remove(server.members);
    await getRepository(Channel).remove(server.channels);
    await getRepository(Role).remove(server.roles);
    await getRepository(Invitation).remove(server.invitations);
  }

  async hasUser(userId: number, force?: boolean) {
    const server = await getRepository(Server).findOne(this.id, { relations: ['members', 'members.user'] });
    return server.members.findIndex(member => member.user.id === userId && (force || !member.quit)) !== -1;
  }
  async hasMember(memberId: number, force?: boolean) {
    const server = await getRepository(Server).findOne(this.id, { relations: ['members', 'members.user'] });
    return server.members.findIndex(member => member.id === memberId && (force || !member.quit)) !== -1;
  }
  async getUser(userId: number, force?: boolean) { 
    const server = await getRepository(Server).findOne(this.id, { relations: ['members', 'members.user'] });
    return server.members.find(member => member.user.id === userId && (force || !member.quit));
  }
  async getMember(memberId: number, force?: boolean) {
    const server = await getRepository(Server).findOne(this.id, { relations: ['members'] });
    return server.members.find(member => member.id === memberId && (force || !member.quit));
  }
  async getEveryoneRole() {
    const server = await getRepository(Server).findOne(this.id, { relations: ['roles'] });
    return server.roles.find(role => role.isEveryone === true);
  }
}
