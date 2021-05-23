import { Post } from "../entities/Post";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

@InputType()
class CreatePostDetails {
  @Field()
  title: string;

  @Field()
  content: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return Post.find({});
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number): Promise<Post | undefined> {
    return Post.findOne({ id });
  }

  @Mutation(() => Post)
  createPost(@Arg("details") details: CreatePostDetails): Promise<Post> {
    return Post.create(details).save();
  }
}
