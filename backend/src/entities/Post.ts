import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Comment } from "./Comment";
import { Module } from "./Module";
import { Upvote } from "./Upvote";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  // extending BaseEntity allows User.create..

  @Field()
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @Field()
  @Column()
  creatorId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @OneToMany(() => Upvote, (upvote) => upvote.post)
  upvotes: Upvote[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  // Module FK
  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true, default: null })
  module_id: number;

  @ManyToOne(() => Module, (module) => module.posts)
  module: Module;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  content!: string;
}
