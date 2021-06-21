import {
  Cache,
  cacheExchange,
  QueryInput,
  Resolver,
} from "@urql/exchange-graphcache";
import Router from "next/router";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  ResetPasswordMutation,
  VoteMutationVariables,
} from "../generated/graphql";
import gql from "graphql-tag";
import isServer from "./isServer";

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

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes("not authenticated")) {
        Router.replace("/login?next=" + Router.pathname);
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
    info.partial = !isItInTheCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
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
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
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
                  return;
                }
                const newPoints =
                  (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
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
    ],
  };
};
export default CreateUrqlClient;
