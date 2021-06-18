import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Module } from "./Module";
import { GroupInvite } from "./GroupInvite";
import { GroupMessage } from "./GroupMessage";
import { Membership } from "./Membership";
import { User } from "./User";
import { GroupRequest } from "./GroupRequest";

@ObjectType()
@Entity()
export class Group extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  // Group PK to Membership
  @OneToMany(() => Membership, (membership) => membership.group)
  members: Membership[];

  // Group PK to GroupMessage
  @OneToMany(() => GroupMessage, (groupMessage) => groupMessage.group)
  messages: GroupMessage[];

  // Group PK to GroupInvite
  @OneToMany(() => GroupInvite, (groupInvite) => groupInvite.group)
  invites: GroupInvite[];

  // Group PK to GroupRequest
  @OneToMany(() => GroupRequest, (groupRequest) => groupRequest.group)
  requests: GroupRequest[];

  // User FK
  @Field(() => Int)
  @Column({ type: "int" })
  creator_id: number;

  @ManyToOne(() => User, (user) => user.groups)
  creator: User;

  // Module FK
  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true, default: null })
  module_id: number;

  @ManyToOne(() => Module, (module) => module.groups)
  module: Module;

  @Field()
  @Column({ unique: true })
  name!: string;

  @Field()
  @Column()
  description!: string;

  @Field()
  @Column()
  requirements!: string;

  @Field()
  @Column()
  slug!: string;

  @Field()
  @Column({ type: "bool", default: false })
  is_private!: boolean;
}
