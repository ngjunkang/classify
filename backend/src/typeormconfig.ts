import { User } from "./entities/User";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import "dotenv-safe/config";

export default {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: true,
  synchronize: true,
  entities: [User, Post],
} as Parameters<typeof createConnection>[0];
