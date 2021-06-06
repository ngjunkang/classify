import { MiddlewareFn } from "type-graphql";
import { ThisContext } from "../types";

const isAuth: MiddlewareFn<ThisContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("not authenticated");
  }

  return next();
};

export default isAuth;
