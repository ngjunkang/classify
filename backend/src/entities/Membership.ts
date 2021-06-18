import { Field } from "type-graphql";
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

@Entity()
export class Membership extends BaseEntity {
  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  // User FK
  @PrimaryColumn()
  user_id: number;

  @ManyToOne(() => User, (user) => user.memberships)
  member: User;

  // Group FK
  @PrimaryColumn()
  group_id: number;

  @ManyToOne(() => Group, (group) => group.members, {
    onDelete: "CASCADE",
  })
  group: Group;

  @Column({ type: "bool", default: false })
  is_leader: boolean;
}
