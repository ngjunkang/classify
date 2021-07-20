import { User } from "./entities/User";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import "dotenv-safe/config";
import { Module } from "./entities/Module";
import { Group } from "./entities/Group";
import { GroupInvite } from "./entities/GroupInvite";
import { GroupMessage } from "./entities/GroupMessage";
import { GroupRequest } from "./entities/GroupRequest";
import { GroupUser } from "./entities/GroupUser";
import { Membership } from "./entities/Membership";
import { Upvote } from "./entities/Upvote";
import { GroupSchedule } from "./entities/GroupSchedule";

export default {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: true,
  synchronize: true,
  entities: [
    User,
    Post,
    Upvote,
    Group,
    GroupInvite,
    GroupRequest,
    GroupMessage,
    GroupUser,
    GroupSchedule,
    Membership,
    Module,
  ],
} as Parameters<typeof createConnection>[0];
