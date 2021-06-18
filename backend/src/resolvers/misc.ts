import { Module } from "../entities/Module";
import { Query, Resolver } from "type-graphql";

@Resolver()
export class MiscResolver {
  @Query(() => [Module])
  modules(): Promise<Module[]> {
    return Module.find({});
  }
}
