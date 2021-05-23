import { User } from "./entities/User";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";

export default {
  type: "postgres",
  port: 5432,
  database: "classify",
  username: "postgres",
  password: "postgres",
  logging: true,
  synchronize: true,
  entities: [User, Post],
} as Parameters<typeof createConnection>[0];
