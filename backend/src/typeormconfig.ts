import { User } from "./entities/User";
import { createConnection } from "typeorm";

export default {
  type: "postgres",
  port: 5433,
  database: "classify",
  username: "postgres",
  password: "postgres",
  logging: true,
  synchronize: true,
  entities: [User],
} as Parameters<typeof createConnection>[0];
