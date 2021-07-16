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
import { Post } from "./Post";
import { Upvote } from "./Upvote";
import { User } from "./User";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: "int" })
  commentId!: number;

  @Field()
  @Column()
  content!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null;

  @Field()
  @Column({ type: "boolean", default: false })
  editMode: boolean;

  @OneToMany(() => Upvote, (upvote) => upvote.comment)
  upvotes: Upvote[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments)
  creator: User;

  @Field()
  @Column()
  creatorId!: number;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
  post: Post;

  @Field()
  @Column()
  postId!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
