import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { ThisContext } from "src/types";
import isAuth from "../middlewares/isAuth";
import { getConnection } from "typeorm";
import { Upvote } from "../entities/Upvote";
import { Comment } from "../entities/Comment";

@InputType()
class CreatePostDetails {
  @Field()
  title: string;

  @Field()
  content: string;
}

@InputType()
class CreateCommentDetails {
  @Field()
  content: string;

  @Field()
  postId: number;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.content.slice(0, 50);
  }

  @FieldResolver(() => [Comment, { nullable: true }])
  async comments(
    @Arg("postID", () => Int) postID: number,
    @Ctx() { req }: ThisContext
  ): Promise<Comment[] | undefined> {
    //return await Comment.find({ postId: postID });
    const userRef: any[] = [];

    if (req.session.userId) {
      userRef.push(req.session.userId);
    }
    const comments = await getConnection().query(
      `
      select c.*,
      ${
        req.session.userId
          ? '(select value from upvote where "userId" = $1 and "postId" = c."postId" and "commentId" = c."commentId") "voteStatus"'
          : 'null as "voteStatus"'
      } 
       from comment c
      where c."postId" = ${postID}
      order by c."points" DESC
      `,
      userRef
    );
    return comments;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: ThisContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;
    const upvote = await Upvote.findOne({
      where: { postId, userId, commentId: 0 },
    });

    // if you have voted before
    // and click the same vote button
    if (upvote && upvote.value === realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
    update upvote 
    set value = $1
    where "postId" = $2 and "userId" = $3 and "commentId" = $4
    `,
          [0, postId, userId, 0]
        );

        await tm.query(
          `
    update post
    set points = points - $1
    where id = $2

    `,
          [realValue, postId]
        );
      });
    }

    //user has voted on post before
    // and they are changing their vote
    else if (upvote && upvote.value === -1 * realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `

    update upvote 
    set value = $1
    where "postId" = $2 and "userId" = $3 and "commentId" = $4
    
    `,
          [realValue, postId, userId, 0]
        );

        await tm.query(
          `

    update post
    set points = points + $1
    where id = $2

    `,
          [2 * realValue, postId]
        );
      });
    } else if (upvote && upvote.value === 0) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `

    update upvote 
    set value = $1
    where "postId" = $2 and "userId" = $3 and "commentId" = $4
    
    `,
          [realValue, postId, userId, 0]
        );

        await tm.query(
          `

    update post
    set points = points + $1
    where id = $2

    `,
          [realValue, postId]
        );
      });
    } else if (!upvote) {
      //has never voted before
      // or unvoted
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
    insert into upvote ("userId", "postId", value, "commentId")
    values ($1, $2, $3, $4)`,
          [userId, postId, realValue, 0]
        );
        await tm.query(
          `
    update post
    set points = points + $1
    where id = $2
    `,
          [realValue, postId]
        );
      });
    }
    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: ThisContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const replacements: any[] = [realLimitPlusOne];

    if (req.session.userId) {
      replacements.push(req.session.userId);
    }

    let cursorIdx = 3;
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
      cursorIdx = replacements.length;
    }
    const posts = await getConnection().query(
      `
    select p.*, 
    json_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email,
      'createdAt', u."createdAt",
      'updatedAt', u."updatedAt"
      ) creator,
      ${
        req.session.userId
          ? '(select value from upvote where "userId" = $2 and "postId" = p.id and "commentId" = 0) "voteStatus"'
          : 'null as "voteStatus"'
      } 
    from post p
    inner join public.user u on u.id = p."creatorId"
    ${cursor ? `where p."createdAt" < $${cursorIdx}` : ""}
    order by p."createdAt" DESC
    limit $1
    `,
      replacements
    );
    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: ThisContext
  ): Promise<Post | undefined> {
    const userRef: any[] = [];

    if (req.session.userId) {
      userRef.push(req.session.userId);
    }
    const singlePost = await getConnection().query(
      `
      select p.*, 
    json_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email,
      'createdAt', u."createdAt",
      'updatedAt', u."updatedAt"
      ) creator,
      ${
        req.session.userId
          ? '(select value from upvote where "userId" = $1 and "postId" = p.id and "commentId" = 0) "voteStatus"'
          : 'null as "voteStatus"'
      } 
    from post p
    inner join public.user u on u.id = p."creatorId"
    where p.id = ${id}
    limit 1
`,
      userRef
    );

    return singlePost[0];
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  createPost(
    @Arg("details") details: CreatePostDetails,
    @Ctx() { req }: ThisContext
  ): Promise<Post> {
    return Post.create({
      ...details,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Arg("content") content: string,
    @Ctx() { req }: ThisContext
  ): Promise<Post | null> {
    const res = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, content })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute();
    return res.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: ThisContext
  ): Promise<boolean> {
    const post = await Post.findOne(id);
    if (post?.creatorId !== req.session.userId) {
      throw new Error("not authorized");
    }
    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  createComment(
    @Arg("input") input: CreateCommentDetails,
    @Ctx() { req }: ThisContext
  ): Promise<Comment> {
    return Comment.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Int)
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg("postId", () => Int) postId: number,
    @Arg("commentId", () => Int) commentId: number,
    @Ctx() { req }: ThisContext
  ): Promise<Number> {
    const comment = await Comment.findOne({
      where: { postId: postId, commentId: commentId },
    });
    if (comment?.creatorId !== req.session.userId) {
      throw new Error("not authorized");
    }
    await Comment.delete({
      postId: postId,
      creatorId: req.session.userId,
      commentId: commentId,
    });

    return comment.postId;
  }

  @Mutation(() => Comment, { nullable: true })
  @UseMiddleware(isAuth)
  async updateComment(
    @Arg("postId", () => Int) postId: number,
    @Arg("commentId", () => Int) commentId: number,
    @Arg("content") content: string,
    @Ctx() { req }: ThisContext
  ): Promise<Comment | null> {
    const res = await getConnection()
      .createQueryBuilder()
      .update(Comment)
      .set({ content })
      .where(
        '"postId" = :postId and "commentId" = :commentId and "creatorId" = :creatorId',
        {
          postId,
          commentId,
          creatorId: req.session.userId,
        }
      )
      .returning("*")
      .execute();
    return res.raw[0];
  }
}
