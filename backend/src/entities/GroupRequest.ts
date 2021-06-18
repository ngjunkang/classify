import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@ObjectType()
@Entity()
export class GroupRequest extends BaseEntity {
  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  // User FK
  @Field(() => Int)
  @PrimaryColumn({ type: "int" })
  user_id: number;

  @ManyToOne(() => User, (user) => user.groupRequests)
  requestee: User;

  // Group FK
  @Field(() => Int)
  @PrimaryColumn({ type: "int" })
  group_id: number;

  @ManyToOne(() => Group, (group) => group.requests, {
    onDelete: "CASCADE",
  })
  group: Group;

  // 0 -> no reply; 1 -> accepted; 2 -> denied
  @Column({ type: "int", default: 0 })
  reply_status: number;
}
