import { Comment } from "../entities/Comment";
import { User } from "../entities/User";
import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { ThisContext } from "../types";
import { Upvote } from "../entities/Upvote";
import { getConnection } from "typeorm";
import isAuth from "../middlewares/isAuth";

@Resolver(Comment)
export class CommentResolver {
  @Query(() => Comment, { nullable: true })
  async comment(
    @Arg("commentId", () => Int) commentId: number
  ): Promise<Comment | undefined> {
    const comm = await Comment.findOne({ where: { commentId: commentId } });

    return comm;
  }

  @Mutation(() => Comment, { nullable: true })
  @UseMiddleware(isAuth)
  async editMode(
    @Arg("postId", () => Int) postId: number,
    @Arg("commentId", () => Int) commentId: number,
    @Ctx() { req }: ThisContext
  ): Promise<Comment | null> {
    const comment = await Comment.findOne({
      where: { postId: postId, commentId: commentId },
    });
    if (comment?.creatorId !== req.session.userId) {
      throw new Error("not authorized");
    }
    const res = await getConnection()
      .createQueryBuilder()
      .update(Comment)
      .set({ editMode: !comment?.editMode })
      .where('"commentId" = :commentId ', {
        commentId,
      })
      .returning("*")
      .execute();
    return res.raw[0];
  }

  @FieldResolver(() => User)
  creator(@Root() comment: Comment) {
    return User.findOne(comment.creatorId);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async voteComment(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Arg("commentId", () => Int) commentId: number,
    @Ctx() { req }: ThisContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;
    const upvote = await Upvote.findOne({
      where: { postId, userId, commentId },
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
          [0, postId, userId, commentId]
        );

        await tm.query(
          `
    update comment
    set points = points - $1
    where "commentId" = $2

    `,
          [realValue, commentId]
        );
      });
    }

    //user has voted on comment before
    // and they are changing their vote
    else if (upvote && upvote.value === -1 * realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `

    update upvote 
    set value = $1
    where "postId" = $2 and "userId" = $3 and "commentId" = $4
    
    `,
          [realValue, postId, userId, commentId]
        );

        await tm.query(
          `

    update comment
    set points = points + $1
    where "commentId" = $2

    `,
          [2 * realValue, commentId]
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
          [realValue, postId, userId, commentId]
        );

        await tm.query(
          `

    update comment
    set points = points + $1
    where "commentId" = $2

    `,
          [realValue, commentId]
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
          [userId, postId, realValue, commentId]
        );
        await tm.query(
          `
    update comment
    set points = points + $1
    where "commentId" = $2
    `,
          [realValue, commentId]
        );
      });
    }
    return true;
  }
}
