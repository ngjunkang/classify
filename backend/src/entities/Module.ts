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

@ObjectType()
@Entity()
export class Module extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Group, (group) => group.module)
  groups: Group[];

  @OneToMany(() => GroupUser, (groupUser) => groupUser.module)
  groupUsers: GroupUser[];

  @Field()
  @Column()
  code!: string;

  @Field()
  @Column()
  name!: string;
}