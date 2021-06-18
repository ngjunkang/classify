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
import { Module } from "./Module";
import { User } from "./User";

@ObjectType()
@Entity()
export class GroupUser extends BaseEntity {
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

  @ManyToOne(() => User, (user) => user.groupUsers)
  creator: User;

  // Module FK
  @Field()
  @Column({ nullable: true, default: null })
  module_id: number;

  @ManyToOne(() => Module, (module) => module.groupUsers)
  module: Module;

  @Field()
  @Column()
  description!: string;

  @Field()
  @Column()
  skillset!: string;
}
