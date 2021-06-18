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
import "dotenv-safe/config";
import helmet from "helmet";
import { GroupResolver } from "./resolvers/group";
import { MiscResolver } from "./resolvers/misc";

const main = async () => {
  await createConnection(typeOrmConfig);
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.set("trust proxy", 1);

  if (PRODUCTION) {
    app.use(helmet());
  }

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
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
        domain: PRODUCTION ? process.env.CDOMAIN : undefined,
      },
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false, // save even when no variable assigned
      resave: false,
      proxy: PRODUCTION,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        UserResolver,
        PostResolver,
        GroupResolver,
        MiscResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(parseInt(process.env.PORT), () => {
    console.log("server started on http://localhost:" + process.env.PORT);
  });
};

main().catch((err) => console.log(err));
