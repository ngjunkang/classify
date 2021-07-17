import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";
import createModuleLoader from "./utils/createModuleLoader";
import createUserLoader from "./utils/createUserLoader";

export type ThisContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId: number };
  };
  res: Response;
  redis: Redis;
  moduleLoader: ReturnType<typeof createModuleLoader>;
  userLoader: ReturnType<typeof createUserLoader>;
};

export type SubscriptionContext = {
  subcriptionRequest: Request & {
    session: Session & Partial<SessionData> & { userId: number };
  };
};
