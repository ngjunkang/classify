import { dedupExchange, fetchExchange, stringifyVariables } from "urql";
import {
  cacheExchange,
  Cache,
  QueryInput,
  Resolver,
} from "@urql/exchange-graphcache";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  LogoutMutation,
  RegisterMutation,
  ResetPasswordMutation,
} from "../generated/graphql";

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

const CreateUrqlClient = (ssrExchange: any) => ({
  url: process.env.NEXT_PUBLIC_API_URL,
  fetchOptions: {
    credentials: "include" as const,
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
    ssrExchange,
    fetchExchange,
  ],
});
export default CreateUrqlClient;
