import { dedupExchange, fetchExchange } from "urql";
import { cacheExchange, Cache, QueryInput } from "@urql/exchange-graphcache";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  LogoutMutation,
  RegisterMutation,
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

const CreateUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
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
