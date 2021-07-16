import { ObjectType, Field } from "type-graphql";
import { Entity, BaseEntity, Column, ManyToOne, PrimaryColumn } from "typeorm";
import { Comment } from "./Comment";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class Upvote extends BaseEntity {
  @Field()
  @Column({ type: "int" })
  value: number;

  @Field()
  @PrimaryColumn()
  userId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.upvotes)
  user: User;

  @Field()
  @PrimaryColumn()
  postId!: number;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.upvotes, { onDelete: "CASCADE" })
  post: Post;

  @Field()
  @PrimaryColumn({ type: "int", default: 0 })
  commentId: number;

  @Field(() => Comment)
  @ManyToOne(() => Comment, (comment) => comment.upvotes, {
    onDelete: "CASCADE",
  })
  comment: Comment;
}
