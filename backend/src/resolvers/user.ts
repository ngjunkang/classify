import { User } from "../entities/User";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { ThisContext } from "../types";
import { validateRegister, validateLogin } from "../utils/validations";
import { COOKIE_NAME, RESET_PASSWORD_PREFIX } from "../constant";
import sendEmail from "../utils/sendEmail";
import { v4 } from "uuid";
import "dotenv-safe/config";
import resetPasswordEmail from "../utils/resetPasswordEmail";
import { getConnection } from "typeorm";

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@InputType()
class RegisterInput {
  @Field()
  email!: string;

  @Field()
  username!: string;

  @Field()
  password!: string;

  @Field()
  displayName!: string;
}

@InputType()
class LoginInput {
  @Field()
  emailOrUsername!: string;

  @Field()
  password!: string;
}

@InputType()
class ResetPasswordInput {
  @Field()
  token!: string;

  @Field()
  password!: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async resetPassword(
    @Arg("data") data: ResetPasswordInput,
    @Ctx() { redis, req }: ThisContext
  ): Promise<UserResponse> {
    // simple password validation
    if (!data.password) {
      return {
        errors: [
          {
            field: "password",
            message: "Password is required",
          },
        ],
      };
    } else if (!(data.password.length > 7 && data.password.length < 21)) {
      return {
        errors: [
          {
            field: "password",
            message: "Password length requirement: 8 to 20 characters",
          },
        ],
      };
    }

    // token validation
    const key = RESET_PASSWORD_PREFIX + data.token;
    const userId = await redis.get(key);

    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "Token expired",
          },
        ],
      };
    }

    const userIdInt = parseInt(userId);
    const user = await User.findOne(userIdInt);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "Invalid token",
          },
        ],
      };
    }

    const newPassword = await argon2.hash(data.password);
    await User.update({ id: userIdInt }, { password: newPassword });
    await redis.del(key);

    req.session.userId = user.id;

    return {
      user: user,
    };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: ThisContext
  ): Promise<Boolean> {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email || email.trim().length > 320 || !regex.test(email)) {
      return true;
    }

    const user = await getConnection()
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where("LOWER(user.email) = :email", { email: email.toLowerCase() })
      .getOne();

    if (user) {
      const token = v4();
      redis.set(RESET_PASSWORD_PREFIX + token, user.id, "ex", 7200000); // two hour to reset

      sendEmail({
        to: email,
        subject: "Reset Password",
        body: resetPasswordEmail({ username: user.displayName, token: token }),
      });
    }

    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: ThisContext) {
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("input") input: RegisterInput,
    @Ctx() { req }: ThisContext
  ): Promise<UserResponse> {
    // server side validation
    const validationErrors: FieldError[] = Object.entries(
      validateRegister(input)
    ).map(([key, value]) => {
      const fieldError: FieldError = {
        field: key,
        message: value,
      };
      return fieldError;
    });

    if (validationErrors.length) {
      return {
        errors: validationErrors,
      };
    }

    const inputEmailLC: string = input.email.toLowerCase();
    const inputUsernameLC: string = input.username.toLowerCase();

    // check for duplicates
    const matchedEntries: User[] = await getConnection()
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where("LOWER(user.email) = :email", { email: inputEmailLC })
      .orWhere("user.username = :username", { username: input.username })
      .getMany();

    if (!matchedEntries.length) {
      const hashedPassword: string = await argon2.hash(input.password);
      const user: User = await User.create({
        email: input.email,
        username: input.username,
        password: hashedPassword,
        displayName: input.displayName,
      }).save();

      req.session.userId = user.id;

      return {
        user: user,
      };
    }

    // see if you can find a better way, but query db once

    const errorArr: FieldError[] = matchedEntries.flatMap((user: User) => {
      const tempErrorArr: FieldError[] = [];
      if (inputUsernameLC === user.username.toLowerCase()) {
        tempErrorArr.push({
          field: "username",
          message: "Username already exist!",
        });
      }

      if (inputEmailLC === user.email.toLowerCase()) {
        tempErrorArr.push({
          field: "email",
          message: "Email already in use!",
        });
      }

      return tempErrorArr;
    });

    return {
      errors: errorArr,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("input") input: LoginInput,
    @Ctx() { req }: ThisContext
  ): Promise<UserResponse> {
    // server side validation
    const validationErrors: FieldError[] = Object.entries(
      validateLogin(input)
    ).map(([key, value]) => {
      const fieldError: FieldError = {
        field: key,
        message: value,
      };
      return fieldError;
    });

    if (validationErrors.length) {
      return {
        errors: validationErrors,
      };
    }

    const dbUser = await getConnection()
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where(
        input.emailOrUsername.includes("@")
          ? "LOWER(user.email) = LOWER(:emailOrUsername)"
          : "user.username = :emailOrUsername",
        {
          emailOrUsername: input.emailOrUsername,
        }
      )
      .getOne();

    if (!dbUser) {
      return {
        errors: [
          {
            field: "emailOrUsername",
            message: "Invalid user",
          },
        ],
      };
    }

    const isValid: boolean = await argon2.verify(
      dbUser.password,
      input.password
    );

    // if( value ) {} will evaluate to true if value is not:
    // null && undefined && NaN && empty string '' && 0 && false

    if (!isValid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };
    }

    // store user id session
    // this will set a cookie on user and log them in
    req.session.userId = dbUser.id;

    return {
      user: dbUser,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: ThisContext): Promise<Boolean> {
    return new Promise((resolver) => {
      req.session.destroy((err) => {
        if (err) {
          resolver(false);
          return;
        }

        res.clearCookie(COOKIE_NAME);
        resolver(true);
      });
    });
  }
}
