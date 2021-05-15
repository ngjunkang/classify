import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
  @Query(() => String) // graphql type
  hey() {
    // ts type
    return "hi";
  }
}
