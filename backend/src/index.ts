import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
import express, { Request, Response } from "express";
import session, { Session, SessionData } from "express-session";
import { RedisPubSub } from "graphql-redis-subscriptions";
import helmet from "helmet";
import { createServer } from "http";
import Redis from "ioredis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, PRODUCTION } from "./constant";
import { GroupResolver } from "./resolvers/group";
import { GroupMessageResolver } from "./resolvers/groupMessage";
import { HelloResolver } from "./resolvers/hello";
import { MiscResolver } from "./resolvers/misc";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import typeOrmConfig from "./typeormconfig";
import { SubscriptionContext } from "./types";
import createModuleLoader from "./utils/createModuleLoader";
import createUserLoader from "./utils/createUserLoader";

const main = async () => {
  await createConnection(typeOrmConfig);
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  // configure Redis connection options
  const options: Redis.RedisOptions = {
    retryStrategy: (times) => Math.max(times * 100, 3000),
  };

  // create Redis-based pub-sub
  const pubSub = new RedisPubSub({
    publisher: new Redis(process.env.REDIS_URL, options),
    subscriber: new Redis(process.env.REDIS_URL, options),
  });

  if (PRODUCTION) {
    // security headers including HSTS
    app.use(helmet());

    // settings to allow it to work behind proxy
    app.set("trust proxy", 1);
  }

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  const mySession = session({
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
  });

  app.use(mySession);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        UserResolver,
        PostResolver,
        GroupResolver,
        MiscResolver,
        GroupMessageResolver,
      ],
      validate: false,
      pubSub,
    }),
    context: ({ req, res, connection }) => {
      let subscribedUser = null;
      if (connection) {
        if (connection.context?.subcriptionRequest) {
          subscribedUser = connection.context.subcriptionRequest;
        }
      }
      return {
        req: subscribedUser ? subscribedUser : req,
        res,
        redis,
        moduleLoader: createModuleLoader(),
        userLoader: createUserLoader(),
      };
    },
    subscriptions: {
      path: "/subscriptions",
      onConnect: async (_params, _ws, { request }) => {
        const subscriptionContext: SubscriptionContext = await new Promise(
          (resolve) => {
            const subcriptionRequest = request as any as Request & {
              session: Session & Partial<SessionData> & { userId: number };
            };
            const subcriptionResponse = {} as any as Response;
            mySession(subcriptionRequest, subcriptionResponse, () => {
              resolve({ subcriptionRequest });
            });
          }
        );
        if (!subscriptionContext) {
          throw new Error("not authenticated");
        }
        return subscriptionContext;
      },
    },
  });

  // use http createServer to run a web socket too, with the old API
  const webServer = createServer(app);

  apolloServer.applyMiddleware({ app, cors: false });

  // allow server to handle subscriptions
  apolloServer.installSubscriptionHandlers(webServer);

  webServer.listen(parseInt(process.env.PORT), () => {
    console.log(
      "subscription server started on ws://localhost:" +
        process.env.PORT +
        apolloServer.subscriptionsPath
    );
    console.log("server started on http://localhost:" + process.env.PORT);
  });
};

main().catch((err) => console.log(err));
