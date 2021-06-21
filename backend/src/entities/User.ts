import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Group } from "./Group";
import { GroupInvite } from "./GroupInvite";
import { GroupMessage } from "./GroupMessage";
import { GroupRequest } from "./GroupRequest";
import { GroupUser } from "./GroupUser";
import { Membership } from "./Membership";
import { Post } from "./Post";
import { Upvote } from "./Upvote";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  // extending BaseEntity allows User.create..

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @OneToMany(() => Upvote, (upvote) => upvote.user)
  upvotes: Upvote[];

  @OneToMany(() => Group, (group) => group.creator)
  groups: Group[];

  @OneToMany(() => GroupUser, (groupUser) => groupUser.creator)
  groupUsers: GroupUser[];

  @OneToMany(() => Membership, (membership) => membership.member)
  memberships: Membership[];

  @OneToMany(() => GroupMessage, (groupMessage) => groupMessage.creator)
  groupMessages: GroupMessage[];

  @OneToMany(() => GroupInvite, (groupInvite) => groupInvite.invitee)
  groupInvites: GroupInvite[];

  @OneToMany(() => GroupRequest, (groupRequest) => groupRequest.requestee)
  groupRequests: GroupRequest[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column({ unique: true })
  username!: string;

  // cannot return password
  @Column()
  password!: string;

  @Field()
  @Column()
  displayName!: string;
}
