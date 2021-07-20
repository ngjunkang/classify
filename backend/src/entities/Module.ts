import { Field, Int, ObjectType } from "type-graphql";
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
import { GroupUser } from "./GroupUser";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class Module extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Group, (group) => group.module)
  groups: Group[];

  @OneToMany(() => GroupUser, (groupUser) => groupUser.module)
  groupUsers: GroupUser[];

  @OneToMany(() => Post, (post) => post.module)
  posts: Post[];

  @Field()
  @Column()
  code!: string;

  @Field()
  @Column()
  name!: string;
}
