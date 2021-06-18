import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@ObjectType()
@Entity()
export class GroupMessage extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  // User FK
  @Field()
  @Column()
  creator_id: number;

  @ManyToOne(() => User, (user) => user.groupMessages)
  creator: User;

  // Group FK
  @Field()
  @Column()
  group_id: number;

  @ManyToOne(() => Group, (group) => group.messages, { onDelete: "CASCADE" })
  group: Group;

  @Field()
  @Column()
  description!: string;

  @Field()
  @Column()
  skillset!: string;
}
