import { MiddlewareFn } from "type-graphql";
import { ThisContext } from "../types";

export const isAuth: MiddlewareFn<ThisContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("not authenticated");
  }

  return next();
};
