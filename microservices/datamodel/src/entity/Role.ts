import { Entity, Column, ManyToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinTable, BeforeRemove, getRepository, AfterInsert, AfterUpdate } from "typeorm";
import { Member, Server, ChannelRoleSettings } from ".";
import { publisher } from "../config";

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

  @Column({default: "#FF0000"})
  color: string;

  @Column({default: false})
  isEveryone: boolean;


  @Column({default: true})
  viewChannels: boolean;
  @Column({default: false})
  viewSeparately: boolean;
  @Column({default: false})
  allowMention: boolean;
  @Column({default: false})
  manageChannels: boolean;
  @Column({default: false})
  manageRoles: boolean;
  @Column({default: false})
  manageServer: boolean;
  @Column({default: true})
  createInvite: boolean;
  @Column({default: true})
  changeNickname: boolean;
  @Column({default: false})
  manageNickname: boolean;
  @Column({default: false})
  kickMembers: boolean;
  @Column({default: false})
  banMembers: boolean;
  @Column({default: true})
  sendMessages: boolean;
  @Column({default: true})
  addReactions: boolean;
  @Column({default: true})
  mentionRoles: boolean;
  @Column({default: false})
  manageMessages: boolean;
  @Column({default: false})
  administrator: boolean;

  // embedLinks
  // attachFiles
  //// manageEmojis
  //// viewAuditLog
  //// manageWebhooks
  //// useExternalEmoji
  //// readMessageHistory
  //// sendTTS
  //// voiceConnect
  //// voiceSpeak
  //// voiceVideo
  //// voiceActivity
  //// voicePriority
  //// voiceMute
  //// voiceDeafen
  //// voiceMove


  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @AfterInsert()
  async insertListener() {
    const role = {...this};
    delete role.members;
    delete role.server;
    if (this.server)
      publisher.publish(`server:${this.server.id}`, JSON.stringify({ action: "roleAdd", data: role}));
  }

  @AfterUpdate()
  async updateListener() {
    const roleTmp = await getRepository(Role).findOne(this.id, {relations: ['server']});
    const role = await getRepository(Role).findOne(this.id, {relations: ['channelRoleSettings']});

    publisher.publish(`server:${roleTmp.server.id}`, JSON.stringify({ action: "roleUpdate", data: role}));
  }

  @BeforeRemove()
  async deleteListener() {
    const roleTmp = await getRepository(Role).findOne(this.id, {relations: ['server']});
    const role = await getRepository(Role).findOne(this.id, {relations: ['channelRoleSettings']});

    publisher.publish(`server:${roleTmp.server.id}`, JSON.stringify({ action: "roleDelete", data: this.id}));
    await getRepository(ChannelRoleSettings).remove(role.channelRoleSettings);
  }
}
