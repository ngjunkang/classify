import {
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription,
} from "type-graphql";
import { NEW_GROUP_MESSAGE_TOPIC } from "../constant";
import { GroupMessage } from "../entities/GroupMessage";
import { User } from "../entities/User";
import { ThisContext } from "../types";

@ArgsType()
class NewGroupMessageSubArgs {
  @Field(() => Int)
  groupId: number;
}

@Resolver(GroupMessage)
export class GroupMessageResolver {
  @FieldResolver(() => User)
  creator(@Root() root: GroupMessage, @Ctx() { userLoader }: ThisContext) {
    return userLoader.load(root.creator_id);
  }

  // message subscription
  @Subscription({
    topics: NEW_GROUP_MESSAGE_TOPIC,
    filter: ({
      payload,
      args,
      context,
    }: ResolverFilterData<
      GroupMessage,
      NewGroupMessageSubArgs,
      ThisContext
    >) => {
      return (
        args.groupId === payload.group_id &&
        context?.req?.session?.userId !== payload.creator_id
      );
    },
  })
  newGroupMessage(
    @Root() groupMessage: GroupMessage,
    @Args() {}: NewGroupMessageSubArgs,
    @Ctx() {}: ThisContext
  ): GroupMessage {
    return groupMessage;
  }
}
