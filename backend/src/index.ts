import "reflect-metadata";
import { createConnection } from "typeorm";
import typeOrmConfig from "./typeormconfig";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { COOKIE_NAME, PRODUCTION } from "./constant";
import cors from "cors";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  await createConnection(typeOrmConfig);
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }), // touch refreshes the session
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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000");
  });
};

main().catch((err) => console.log(err));
