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
export class GroupSchedule extends BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // User FK
  @Field(() => Int)
  @PrimaryColumn({ type: "int" })
  user_id: number;

  @ManyToOne(() => User, (user) => user.groupSchedules)
  user: User;

  // Group FK
  @Field(() => Int)
  @PrimaryColumn({ type: "int" })
  group_id: number;

  @ManyToOne(() => Group, (group) => group.schedules, { onDelete: "CASCADE" })
  group: Group;

  @Field(() => String)
  @PrimaryColumn({ type: "timestamp" })
  timestamp!: Date;

  // true: available, false: not available, null: NIL
  @Field(() => Boolean, { nullable: true })
  @Column({ type: "bool", nullable: true, default: true })
  availability!: boolean;
}
