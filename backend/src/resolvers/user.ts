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
import { COOKIE_NAME } from "../constant";

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class FieldError {
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

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: ThisContext) {
    if (!req.session.userId) {
      return null;
    }

    const user = await User.findOne(req.session.userId);
    return user;
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

    // check for duplicates
    const matchedEntries: User[] = await User.find({
      where: [{ username: input.username }, { email: input.email }],
    });

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
      if (input.username === user.username) {
        tempErrorArr.push({
          field: "username",
          message: "Username already exist!",
        });
      }

      if (input.email === user.email) {
        tempErrorArr.push({
          field: "email",
          message: "Email already in use!",
        });
      }
      console.log(tempErrorArr);
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

    const dbUser = await User.findOne({
      where: input.emailOrUsername.includes("@")
        ? { email: input.emailOrUsername }
        : { username: input.emailOrUsername },
    });

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
