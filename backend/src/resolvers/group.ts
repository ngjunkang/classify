import slugify from "slugify";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Group } from "../entities/Group";
import { GroupInvite } from "../entities/GroupInvite";
import { GroupRequest } from "../entities/GroupRequest";
import { Membership } from "../entities/Membership";
import { Module } from "../entities/Module";
import { User } from "../entities/User";
import isAuth from "../middlewares/isAuth";
import { ThisContext } from "../types";
import { FieldError } from "./user";

@InputType()
class GroupCreationInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  requirements: string;

  @Field()
  moduleId: number;

  @Field()
  isPrivate: boolean;
}

@InputType()
class InviteToGroupByIdInput {
  @Field(() => Int)
  groupId: number;

  @Field(() => Int)
  userId: number;
}

@InputType()
class ReplyRequestInput {
  @Field(() => Int)
  groupId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Boolean)
  accept: boolean;
}

@InputType()
class ReplyInviteInput {
  @Field(() => Int)
  groupId: number;

  @Field(() => Boolean)
  accept: boolean;
}

@InputType()
class InviteToGroupByUserInput {
  @Field(() => Int)
  groupId: number;

  @Field()
  username: string;
}

@ObjectType()
class GroupResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Group, { nullable: true })
  group?: Group;
}

@ObjectType()
class Status {
  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  success: boolean;
}

@ObjectType()
class GroupInfo {
  // group
  @Field(() => Int)
  id: number;

  // group
  @Field(() => String)
  name: string;

  // group
  @Field(() => String)
  description: string;

  // group
  @Field(() => String)
  requirements: string;

  // group
  @Field(() => String)
  slug: string;

  // group
  @Field(() => Boolean)
  isPrivate: boolean;

  @Field(() => Boolean)
  isMember: boolean;

  // group
  @Field(() => Module, { nullable: true })
  module?: Module;

  @Field(() => Boolean, { nullable: true })
  isLeader?: boolean;

  @Field(() => GroupInvite, { nullable: true })
  invite?: GroupInvite;

  @Field(() => [GroupRequest], { nullable: true })
  requests?: GroupRequest[];

  @Field(() => [User], { nullable: true })
  members?: User[];
}

@Resolver(Group)
export class GroupResolver {
  @FieldResolver(() => Module, { nullable: true })
  module(@Root() group: Group): Promise<Module | undefined> {
    return Module.findOne({ id: group.module_id });
  }

  @FieldResolver(() => [User])
  async members(
    @Root() group: Group,
    @Ctx() { req }: ThisContext
  ): Promise<User[]> {
    let users: User[] = [];
    const allMembers: Membership[] = await Membership.find({
      group_id: group.id,
    });
    const allMembersId = allMembers.map((member) => member.user_id);

    if (allMembersId.includes(req.session.userId)) {
      // if user is a member
      users = await User.findByIds(allMembersId);
    }

    return users;
  }

  @FieldResolver(() => [GroupRequest])
  async requests(
    @Root() group: Group,
    @Ctx() { req }: ThisContext
  ): Promise<GroupRequest[]> {
    // is Leader
    let allRequests: GroupRequest[] = [];
    const leader = await Membership.findOne({
      user_id: req.session.userId,
      group_id: group.id,
      is_leader: true,
    });

    if (!leader) {
      return allRequests;
    }

    return GroupRequest.find({ group_id: group.id });
  }

  @FieldResolver(() => GroupInvite, { nullable: true })
  invite(
    @Root() group: Group,
    @Ctx() { req }: ThisContext
  ): Promise<GroupInvite | undefined> {
    return GroupInvite.findOne({
      group_id: group.id,
      user_id: req.session.userId,
      reply_status: 0,
    });
  }

  @Mutation(() => Status)
  @UseMiddleware(isAuth)
  async leaveGroup(
    @Arg("groupId", () => Int) groupId: number,
    @Ctx() { req }: ThisContext
  ): Promise<Status> {
    // check if user in group
    const member = await Membership.findOne({
      user_id: req.session.userId,
      group_id: groupId,
    });

    if (!member) {
      return { success: false, message: "You are not in this group" };
    }

    // if member is a leader
    if (member.is_leader) {
      const nextInLine = await Membership.findOne({
        group_id: groupId,
        is_leader: false,
      });
      if (!nextInLine) {
        // if no successor
        Group.delete(groupId);
      } else {
        Membership.update(
          { user_id: nextInLine.user_id, group_id: groupId },
          { is_leader: true }
        );
      }
    }

    // delete entry in Membership
    await Membership.delete({
      user_id: req.session.userId,
      group_id: groupId,
    });

    return { success: true, message: "Left the group" };
  }

  // Request to group, only accepted by leader, require req.session.userId
  @Mutation(() => Status)
  @UseMiddleware(isAuth)
  async replyRequest(
    @Arg("input") { userId, groupId, accept }: ReplyRequestInput,
    @Ctx() { req }: ThisContext
  ): Promise<Status> {
    // check my Accept/deny rights
    const member = await Membership.findOne({
      user_id: req.session.userId,
      group_id: groupId,
    });

    if (!member) {
      return { success: false, message: "You are not a member of this group" };
    } else if (!member.is_leader) {
      return { success: false, message: "You are not the leader" };
    }

    // check if there's request
    const request = await GroupRequest.findOne({
      user_id: userId,
      group_id: groupId,
      reply_status: 0,
    });

    if (!request) {
      return { success: false, message: "Request no longer available!" };
    }

    await GroupRequest.update(
      {
        user_id: userId,
        group_id: groupId,
        reply_status: 0,
      },
      { reply_status: accept ? 1 : 2 }
    );

    if (accept) {
      await Membership.create({
        user_id: userId,
        group_id: groupId,
      }).save();
    }

    return {
      success: true,
      message: accept ? "User accepted!" : "User declined!",
    };
  }

  // Invite into group
  @Mutation(() => Status)
  @UseMiddleware(isAuth)
  async replyInvite(
    @Arg("input") { groupId, accept }: ReplyInviteInput,
    @Ctx() { req }: ThisContext
  ): Promise<Status> {
    // check if already invited
    const invite = await GroupInvite.findOne({
      user_id: req.session.userId,
      group_id: groupId,
      reply_status: 0,
    });

    if (!invite) {
      return { success: false, message: "Invite no longer available!" };
    }

    // update reply status
    await GroupInvite.update(
      {
        user_id: req.session.userId,
        group_id: groupId,
        reply_status: 0,
      },
      { reply_status: accept ? 1 : 2 }
    );

    // add member to group
    if (accept) {
      await Membership.create({
        user_id: req.session.userId,
        group_id: groupId,
      }).save();
    }

    return {
      success: true,
      message: accept ? "You joined the group!" : "You declined!",
    };
  }

  @Mutation(() => Status)
  @UseMiddleware(isAuth)
  async requestToGroup(
    @Arg("groupId", () => Int) groupId: number,
    @Ctx() { req }: ThisContext
  ): Promise<Status> {
    // check if user in group
    const isUserInGroup = !!(await Membership.findOne({
      user_id: req.session.userId,
      group_id: groupId,
    }));

    if (isUserInGroup) {
      return { success: false, message: "You are already in this group" };
    }

    // check if already requested
    const isRequested = !!(await GroupRequest.findOne({
      user_id: req.session.userId,
      group_id: groupId,
      reply_status: 0,
    }));

    if (isRequested) {
      return { success: false, message: "Request already sent!" };
    }

    await GroupRequest.create({
      user_id: req.session.userId,
      group_id: groupId,
    }).save();

    return { success: true, message: "Request sent!" };
  }

  @Mutation(() => Status)
  @UseMiddleware(isAuth)
  async inviteToGroupByUsername(
    @Arg("input") { username, groupId }: InviteToGroupByUserInput,
    @Ctx() ctx: ThisContext
  ): Promise<Status> {
    const user = await User.findOne({ username: username });
    if (!user) {
      return { success: false, message: "User does not exist" };
    }
    return this.inviteToGroupById({ userId: user.id, groupId: groupId }, ctx);
  }

  @Mutation(() => Status)
  @UseMiddleware(isAuth)
  async inviteToGroupById(
    @Arg("input") { userId, groupId }: InviteToGroupByIdInput,
    @Ctx() { req }: ThisContext
  ): Promise<Status> {
    // check my Invite rights
    const member = await Membership.findOne({
      user_id: req.session.userId,
      group_id: groupId,
    });

    if (!member) {
      return { success: false, message: "You are not a member of this group" };
    } else if (!member.is_leader) {
      return { success: false, message: "You are not the leader" };
    }

    // check if user in group
    const isUserInGroup = !!(await Membership.findOne({
      user_id: userId,
      group_id: groupId,
    }));

    if (isUserInGroup) {
      return { success: false, message: "User is already in group" };
    }

    // check if already invited
    const isInvited = !!(await GroupInvite.findOne({
      user_id: userId,
      group_id: groupId,
      reply_status: 0,
    }));

    if (isInvited) {
      return { success: false, message: "User is already invited" };
    }

    await GroupInvite.create({
      user_id: userId,
      group_id: groupId,
    }).save();

    return { success: true, message: "User Invited" };
  }

  @Mutation(() => GroupResponse)
  @UseMiddleware(isAuth)
  async createGroup(
    @Arg("input") input: GroupCreationInput,
    @Ctx() { req }: ThisContext
  ): Promise<GroupResponse> {
    let nameErrorMessage: string = "";
    if (!input.name) {
      nameErrorMessage = "Group name required";
    } else if (!/^[A-Za-z0-9\s]+$/.test(input.name.trim())) {
      nameErrorMessage =
        "Only lowercase alphanumeric characters and spaces are allowed";
    } else if (
      !(input.name.trim().length > 5 && input.name.trim().length < 41)
    ) {
      nameErrorMessage = "Group Name length requirement: 6 to 40 characters";
    }

    if (nameErrorMessage) {
      return { errors: [{ field: "name", message: nameErrorMessage }] };
    }

    const { moduleId, ...noModProps } = input;

    const userInput = moduleId === 0 ? noModProps : input;
    const group = await Group.create({
      ...userInput,
      creator_id: req.session.userId,
      slug: slugify(userInput.name),
    })
      .save()
      .catch((err) => {
        if (err.code !== "23505") {
          console.error("Unhandled error: ", err);
        }
        return undefined;
      });

    if (group === undefined) {
      return { errors: [{ field: "name", message: "Group already exist" }] };
    } else {
      await Membership.create({
        user_id: req.session.userId,
        group_id: group.id,
        is_leader: true,
      }).save();
      return { group: group };
    }
  }

  @Query(() => GroupInfo, { nullable: true })
  async group(
    @Arg("slug") slug: string,
    @Ctx() { req }: ThisContext
  ): Promise<GroupInfo | undefined> {
    // get group
    const group = await Group.findOne({ slug: slug });

    // no such group
    if (!group) {
      return undefined;
    }

    // get module
    const module = await Module.findOne(group.module_id);

    // is member
    const allMembers: Membership[] = await Membership.find({
      group_id: group.id,
    });
    const allMembersId = allMembers.map((member) => member.user_id);

    if (!allMembersId.includes(req.session.userId)) {
      // if user is not a member
      // get invite
      const invite = await GroupInvite.findOne({
        group_id: group.id,
        user_id: req.session.userId,
        reply_status: 0,
      });

      return {
        id: group.id,
        name: group.name,
        description: group.description,
        requirements: group.requirements,
        slug: group.slug,
        isPrivate: group.is_private,
        module: module,
        invite: invite,
        isMember: false,
      };
    }

    const users: User[] = await User.findByIds(allMembersId);
    let isLeader: boolean = false;
    let requests = undefined;
    if (
      allMembers.filter(
        (member) => member.is_leader && member.user_id === req.session.userId
      ).length
    ) {
      // is leader
      isLeader = true;
      requests = await GroupRequest.find({
        group_id: group.id,
        reply_status: 0,
      });
    }

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      requirements: group.requirements,
      slug: group.slug,
      isPrivate: group.is_private,
      module: module,
      requests: requests,
      isMember: true,
      isLeader: isLeader,
      members: users,
    };
  }

  @Query(() => [Group])
  myGroups(@Ctx() { req }: ThisContext): Promise<Group[]> {
    return Group.find({ creator_id: req.session.userId });
  }

  @Query(() => [Group])
  groups(): Promise<Group[]> {
    return Group.find({ is_private: false });
  }
}
