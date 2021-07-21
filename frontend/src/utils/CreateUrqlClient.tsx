import {
  Cache,
  cacheExchange,
  QueryInput,
  Resolver,
} from "@urql/exchange-graphcache";
import startOfWeek from "date-fns/startOfWeek";
import gql from "graphql-tag";
import Router from "next/router";
import { SubscriptionClient } from "subscriptions-transport-ws";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
  subscriptionExchange,
} from "urql";
import { pipe, tap } from "wonka";
import {
  CreateCommentMutationVariables,
  DeletePostMutationVariables,
  DisbandGroupMutationVariables,
  EditGroupMutationVariables,
  EditModeMutationVariables,
  GetScheduleDatesDocument,
  GetScheduleDatesQuery,
  Group,
  GroupMessage,
  LeaveGroupMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  MeQueryVariables,
  NewGroupMessageSubscription,
  NewGroupMessageSubscriptionVariables,
  RegisterMutation,
  ReplyInviteMutation,
  ReplyInviteMutationVariables,
  ReplyRequestMutation,
  ReplyRequestMutationVariables,
  ResetPasswordMutation,
  SendScheduleDatesMutation,
  SendScheduleDatesMutationVariables,
  ToggleEditMutationVariables,
  UserDetailsFragment,
  VoteCommentMutationVariables,
  VoteMutationVariables,
  WriteMessageMutation,
  WriteMessageMutationVariables,
} from "../generated/graphql";
import isServer from "./isServer";

const generateSubClient = (): SubscriptionClient => {
  const subscriptionClient = new SubscriptionClient(
    process.env.NEXT_PUBLIC_SUBSCRIPTION_WS,
    {
      reconnect: true,
    }
  );
  return subscriptionClient;
};

function updateCacheQuery<Result, Query>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  func: (res: Result, query: Query) => Query
) {
  return cache.updateQuery(
    queryInput,
    (data) => func(result, data as any) as any
  );
}

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes("not authenticated")) {
          Router.replace("/login?next=" + Router.asPath);
        }
      })
    );
  };

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    //const isItInTheCache = cache.resolve(entityKey, fieldKey);

    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      fieldName
    );

    const filteredFI = fieldInfos.filter((fi) => fi.fieldKey === fieldKey);

    info.partial = !isItInTheCache;
    let hasMore = true;
    let results: string[] = [];
    filteredFI.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, fi.fieldName) as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};

const CreateUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) {
    cookie = ctx?.req?.headers.cookie;
  }
  return {
    url: process.env.NEXT_PUBLIC_API_URL,
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
          GroupSchedule: () => null,
        },
        resolvers: {
          GroupMessage: {
            updatedAt: (parent: GroupMessage) => {
              if (!/^[0-9]+$/.test(parent.updatedAt)) {
                return new Date(parent.updatedAt).valueOf().toString();
              }
              return parent.updatedAt;
            },
            createdAt: (parent: GroupMessage) => {
              if (!/^[0-9]+$/.test(parent.createdAt)) {
                return new Date(parent.createdAt).valueOf().toString();
              }
              return parent.createdAt;
            },
          },
          Query: {
            posts: cursorPagination(),
          },
        },
        optimistic: {
          writeMessage: (variables, cache, info) => {
            const now: string = Date.parse(new Date().toString()).toString();
            const me = cache.readQuery<MeQuery, MeQueryVariables>({
              query: MeDocument,
            });
            return {
              __typename: "GroupMessage",
              id: 0,
              createdAt: now,
              updatedAt: now,
              creator: me.me,
              message: (variables as WriteMessageMutationVariables).input
                .message,
            };
          },
        },
        updates: {
          Subscription: {
            newGroupMessage(result, args, cache, info) {
              const group = cache.readFragment<
                Group,
                NewGroupMessageSubscriptionVariables
              >(
                gql`
                  fragment __ on Group {
                    id
                    messages {
                      id
                      createdAt
                      updatedAt
                      creator {
                        id
                        username
                        displayName
                      }
                      message
                    }
                  }
                `,
                {
                  id: (args as NewGroupMessageSubscriptionVariables).groupId,
                } as any
              );

              if (group) {
                if (group.messages) {
                  cache.writeFragment<Group>(
                    gql`
                      fragment __ on Group {
                        id
                        messages {
                          id
                          createdAt
                          updatedAt
                          creator {
                            id
                            username
                            displayName
                          }
                          message
                        }
                      }
                    `,
                    {
                      id: (args as NewGroupMessageSubscriptionVariables)
                        .groupId,
                      messages: [
                        ...group.messages,
                        (result as NewGroupMessageSubscription).newGroupMessage,
                      ],
                    } as any
                  );
                }
              }
            },
          },
          Mutation: {
            sendScheduleDates: (result, args, cache, info) => {
              if (
                (result as SendScheduleDatesMutation).sendScheduleDates.success
              ) {
                const me = cache.readQuery<MeQuery, MeQueryVariables>({
                  query: MeDocument,
                });

                updateCacheQuery<
                  SendScheduleDatesMutation,
                  GetScheduleDatesQuery
                >(
                  cache,
                  {
                    query: GetScheduleDatesDocument,
                    variables: {
                      input: {
                        groupId: (args as SendScheduleDatesMutationVariables)
                          .input.groupId,
                        startDate: startOfWeek(
                          (args as SendScheduleDatesMutationVariables).input.add
                            .length
                            ? (args as SendScheduleDatesMutationVariables).input
                                .add[0]
                            : (args as SendScheduleDatesMutationVariables).input
                                .remove[0]
                        ),
                      },
                    },
                  },
                  result,
                  (res, query) => {
                    const scheduleDates = query.getScheduleDates;
                    const scheduleDatesFiltered = scheduleDates.filter(
                      (date1) =>
                        !(
                          args as SendScheduleDatesMutationVariables
                        ).input.remove.some(
                          (date2) =>
                            date1.timestamp ===
                            (date2 as Date).getTime().toString()
                        )
                    );

                    return {
                      getScheduleDates: [
                        ...scheduleDatesFiltered,
                        ...(
                          args as SendScheduleDatesMutationVariables
                        ).input.add.map((date) => ({
                          __typename: "GroupSchedule" as const,
                          timestamp: (date as Date).getTime().toString(),
                          group_id: (args as SendScheduleDatesMutationVariables)
                            .input.groupId,
                          user_id: me?.me.id,
                        })),
                      ],
                    };
                  }
                );
              }
            },
            writeMessage: (result, args, cache, info) => {
              const group = cache.readFragment<
                Group,
                WriteMessageMutationVariables
              >(
                gql`
                  fragment __ on Group {
                    id
                    messages {
                      id
                      createdAt
                      updatedAt
                      creator {
                        id
                        username
                        displayName
                      }
                      message
                    }
                  }
                `,
                {
                  id: (args as WriteMessageMutationVariables).input.groupId,
                } as any
              );

              if (group) {
                if (group.messages) {
                  cache.writeFragment<Group>(
                    gql`
                      fragment __ on Group {
                        id
                        messages {
                          id
                          createdAt
                          updatedAt
                          creator {
                            id
                            username
                            displayName
                          }
                          message
                        }
                      }
                    `,
                    {
                      id: (args as WriteMessageMutationVariables).input.groupId,
                      messages: [
                        ...group.messages,
                        (result as WriteMessageMutation).writeMessage,
                      ],
                    } as any
                  );
                }
              }
            },
            disbandGroup: (result, args, cache, info) => {
              cache.invalidate({
                __typename: "Group",
                id: (args as DisbandGroupMutationVariables).groupId,
              });
            },
            leaveGroup: (result, args, cache, info) => {
              cache.invalidate({
                __typename: "Group",
                id: (args as LeaveGroupMutationVariables).groupId,
              });
            },
            editGroup: (result, args, cache, info) => {
              const group = cache.readFragment(
                gql`
                  fragment __ on Group {
                    id
                    description
                    requirements
                    module {
                      id
                      name
                      code
                    }
                  }
                `,
                {
                  id: (args as EditGroupMutationVariables).input.id,
                } as any
              );

              if (group) {
                const cacheMod = group.module ? group.module.id : 0;
                if (
                  cacheMod !==
                  (args as EditGroupMutationVariables).input.module_id
                ) {
                  cache.invalidate({
                    __typename: "Group",
                    id: (args as EditGroupMutationVariables).input.id,
                  });
                } else {
                  cache.writeFragment(
                    gql`
                      fragment _ on Group {
                        id
                        description
                        requirements
                        is_private
                      }
                    `,
                    {
                      id: (args as EditGroupMutationVariables).input.id,
                      description: (args as EditGroupMutationVariables).input
                        .description,
                      requirements: (args as EditGroupMutationVariables).input
                        .requirements,
                      is_private: (args as EditGroupMutationVariables).input
                        .is_private,
                    } as any
                  );
                }
              }
            },
            createGroup: (result, args, cache, info) => {
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "groups"
              );
              fieldInfos.forEach((fi) => {
                cache.invalidate("Query", "groups", fi.arguments || {});
              });
            },
            replyInvite: (result, args, cache, info) => {
              if (
                (result as ReplyInviteMutation).replyInvite.success &&
                (result as ReplyInviteMutation).replyInvite.message ===
                  "You joined the group!"
              ) {
                cache.invalidate({
                  __typename: "Group",
                  id: (args as ReplyInviteMutationVariables).input.groupId,
                });
              } else {
                cache.writeFragment(
                  gql`
                    fragment _ on Group {
                      id
                      invite
                    }
                  `,
                  {
                    id: (args as ReplyInviteMutationVariables).input.groupId,
                    invite: false,
                  } as any
                );
              }
            },
            replyRequest: (result, args, cache, info) => {
              const group = cache.readFragment(
                gql`
                  fragment readGroup on Group {
                    id
                    requests {
                      id
                      username
                      displayName
                    }
                    members {
                      id
                      username
                      displayName
                    }
                  }
                `,
                {
                  id: (args as ReplyRequestMutationVariables).input.groupId,
                } as any
              );

              if (group) {
                if (group.requests) {
                  const requests: UserDetailsFragment[] = group.requests.filter(
                    (req: UserDetailsFragment) =>
                      req.id !==
                      (args as ReplyRequestMutationVariables).input.userId
                  );

                  cache.writeFragment(
                    gql`
                      fragment writeRequest on Group {
                        id
                        requests {
                          id
                          username
                          displayName
                        }
                      }
                    `,
                    {
                      id: (args as ReplyInviteMutationVariables).input.groupId,
                      requests: requests,
                    } as any
                  );

                  if (
                    (result as ReplyRequestMutation).replyRequest.success &&
                    (result as ReplyRequestMutation).replyRequest.message ===
                      "User accepted!"
                  ) {
                    if (group.members) {
                      const members: UserDetailsFragment[] = group.members;
                      const user: UserDetailsFragment = group.requests.find(
                        (req: UserDetailsFragment) =>
                          req.id ===
                          (args as ReplyRequestMutationVariables).input.userId
                      );

                      members.push(user);

                      cache.writeFragment(
                        gql`
                          fragment writeMembers on Group {
                            id
                            members {
                              id
                              username
                              displayName
                            }
                          }
                        `,
                        {
                          id: (args as ReplyInviteMutationVariables).input
                            .groupId,
                          members: members,
                        } as any
                      );
                    }
                  }
                }
              }
            },
            deletePost: (_result, args, cache, info) => {
              cache.invalidate({
                __typename: "Post",
                id: (args as DeletePostMutationVariables).id,
              });
            },
            vote: (_result, args, cache, info) => {
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId } as any
              );
              if (data) {
                if (data.voteStatus === value) {
                  const newPoints = (data.points as number) + -1 * value;
                  cache.writeFragment(
                    gql`
                      fragment __ on Post {
                        points
                        voteStatus
                      }
                    `,
                    { id: postId, points: newPoints, voteStatus: null } as any
                  );
                } else {
                  const newPoints =
                    (data.points as number) +
                    (!data.voteStatus ? 1 : 2) * value;
                  cache.writeFragment(
                    gql`
                      fragment __ on Post {
                        points
                        voteStatus
                      }
                    `,
                    { id: postId, points: newPoints, voteStatus: value } as any
                  );
                }
              }
            },
            createPost: (_result, args, cache, info) => {
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "posts"
              );
              fieldInfos.forEach((fi) => {
                cache.invalidate("Query", "posts", fi.arguments || {});
              });
            },
            createComment: (_result, args, cache, info) => {
              const { input } = args as CreateCommentMutationVariables;
              cache.invalidate({
                __typename: "Post",
                id: input.postId,
              });
            },
            editMode: (_result, args, cache, info) => {
              const { postId } = args as EditModeMutationVariables;
              cache.invalidate({
                __typename: "Post",
                id: postId,
              });
            },
            deleteComment: (_result, args, cache, info) => {
              const { postId } = args as VoteCommentMutationVariables;
              cache.invalidate({
                __typename: "Post",
                id: postId,
              });
            },
            voteComment: (_result, args, cache, info) => {
              const { postId } = args as VoteCommentMutationVariables;
              cache.invalidate({
                __typename: "Post",
                id: postId,
              });
            },
            toggleEdit: (result, args, cache, info) => {
              cache.invalidate({
                __typename: "User",
                id: (args as ToggleEditMutationVariables).userId,
              });
            },
            resetPassword: (result, args, cache, info) => {
              updateCacheQuery<ResetPasswordMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                (res, query) => {
                  if (res.resetPassword.errors) {
                    return query;
                  } else {
                    return {
                      me: res.resetPassword.user,
                    };
                  }
                }
              );
            },
            login: (result, args, cache, info) => {
              updateCacheQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                (res, query) => {
                  if (res.login.errors) {
                    return query;
                  } else {
                    return {
                      me: res.login.user,
                    };
                  }
                }
              );
            },
            logout: (result, args, cache, info) => {
              updateCacheQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                (res, query) => {
                  return { me: null };
                }
              );
            },
            register: (result, args, cache, info) => {
              updateCacheQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                (res, query) => {
                  if (res.register.errors) {
                    return query;
                  } else {
                    return {
                      me: res.register.user,
                    };
                  }
                }
              );
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
      subscriptionExchange({
        forwardSubscription: (operation) => {
          return generateSubClient().request(operation);
        },
      }),
    ],
  };
};
export default CreateUrqlClient;
