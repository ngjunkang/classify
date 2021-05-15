import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import typeOrmConfig from "./typeormconfig";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { PRODUCTION } from "./constant";

const main = async () => {
  const conn: Connection = await createConnection(typeOrmConfig);
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: "cid",
      store: new RedisStore({ client: redisClient, disableTouch: true }), // touch refreshes the session
      cookie: {
        maxAge: 86400 * 365, // one year
        httpOnly: true,
        sameSite: "lax",
        secure: PRODUCTION, // only works in https
      },
      secret: "jkykpythong", // to be changed
      saveUninitialized: false, // save even when no variable assigned
      resave: false,
    })
  );

  console.log(conn.name);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000");
  });
};

main().catch((err) => console.log(err));
