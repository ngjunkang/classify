import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";
import createModuleLoader from "./utils/createModuleLoader";

export type ThisContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId: number };
  };
  res: Response;
  redis: Redis;
  moduleLoader: ReturnType<typeof createModuleLoader>;
};
