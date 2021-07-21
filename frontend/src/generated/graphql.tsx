import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Comment = {
  __typename?: 'Comment';
  commentId: Scalars['Float'];
  content: Scalars['String'];
  points: Scalars['Float'];
  voteStatus?: Maybe<Scalars['Int']>;
  editMode: Scalars['Boolean'];
  creator: User;
  creatorId: Scalars['Float'];
  post: Post;
  postId: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type CreateCommentDetails = {
  content: Scalars['String'];
  postId: Scalars['Float'];
};

export type CreatePostDetails = {
  title: Scalars['String'];
  content: Scalars['String'];
  module_id: Scalars['Float'];
};


export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type GetScheduleDatesInput = {
  groupId: Scalars['Int'];
  startDate: Scalars['DateTime'];
};

export type Group = {
  __typename?: 'Group';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  creator_id: Scalars['Int'];
  module_id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  description: Scalars['String'];
  requirements: Scalars['String'];
  slug: Scalars['String'];
  is_private: Scalars['Boolean'];
  module?: Maybe<Module>;
  isLeader: Scalars['Boolean'];
  isMember: Scalars['Boolean'];
  members: Array<User>;
  requests: Array<User>;
  invite: Scalars['Boolean'];
  messages: Array<GroupMessage>;
};

export type GroupCreationInput = {
  name: Scalars['String'];
  description: Scalars['String'];
  requirements: Scalars['String'];
  module_id: Scalars['Float'];
  is_private: Scalars['Boolean'];
};

export type GroupEditInput = {
  id: Scalars['Int'];
  description: Scalars['String'];
  requirements: Scalars['String'];
  module_id: Scalars['Float'];
  is_private: Scalars['Boolean'];
};

export type GroupMessage = {
  __typename?: 'GroupMessage';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  creator_id: Scalars['Int'];
  group_id: Scalars['Int'];
  message: Scalars['String'];
  creator: User;
};

export type GroupMessageInput = {
  groupId: Scalars['Int'];
  message: Scalars['String'];
};

export type GroupResponse = {
  __typename?: 'GroupResponse';
  errors?: Maybe<Array<FieldError>>;
  group?: Maybe<Group>;
};

export type GroupSchedule = {
  __typename?: 'GroupSchedule';
  user_id: Scalars['Int'];
  group_id: Scalars['Int'];
  timestamp: Scalars['String'];
  availability?: Maybe<Scalars['Boolean']>;
};

export type InviteToGroupByIdInput = {
  groupId: Scalars['Int'];
  userId: Scalars['Int'];
};

export type InviteToGroupByUserInput = {
  groupId: Scalars['Int'];
  username: Scalars['String'];
};

export type LoginInput = {
  emailOrUsername: Scalars['String'];
  password: Scalars['String'];
};

export type Module = {
  __typename?: 'Module';
  id: Scalars['Int'];
  code: Scalars['String'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  editUser: UserResponse;
  toggleEdit: Scalars['Boolean'];
  resetPassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  verifyEmail: UserResponse;
  verificationEmail: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  disbandGroup: Status;
  leaveGroup: Status;
  replyRequest: Status;
  replyInvite: Status;
  requestToGroup: Status;
  inviteToGroupByUsername: Status;
  inviteToGroupById: Status;
  editGroup: Status;
  createGroup: GroupResponse;
  writeMessage: GroupMessage;
  sendScheduleDates: Status;
  vote: Scalars['Boolean'];
  createPost: Post;
  updatePost?: Maybe<Post>;
  deletePost: Scalars['Boolean'];
  createComment: Comment;
  deleteComment: Scalars['Int'];
  updateComment?: Maybe<Comment>;
  editMode?: Maybe<Comment>;
  voteComment: Scalars['Boolean'];
};


export type MutationEditUserArgs = {
  displayName: Scalars['String'];
  description: Scalars['String'];
  email: Scalars['String'];
  userId: Scalars['Int'];
};


export type MutationToggleEditArgs = {
  userId: Scalars['Int'];
};


export type MutationResetPasswordArgs = {
  data: ResetPasswordInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
};


export type MutationVerificationEmailArgs = {
  userId: Scalars['Int'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationDisbandGroupArgs = {
  groupId: Scalars['Int'];
};


export type MutationLeaveGroupArgs = {
  groupId: Scalars['Int'];
};


export type MutationReplyRequestArgs = {
  input: ReplyRequestInput;
};


export type MutationReplyInviteArgs = {
  input: ReplyInviteInput;
};


export type MutationRequestToGroupArgs = {
  groupId: Scalars['Int'];
};


export type MutationInviteToGroupByUsernameArgs = {
  input: InviteToGroupByUserInput;
};


export type MutationInviteToGroupByIdArgs = {
  input: InviteToGroupByIdInput;
};


export type MutationEditGroupArgs = {
  input: GroupEditInput;
};


export type MutationCreateGroupArgs = {
  input: GroupCreationInput;
};


export type MutationWriteMessageArgs = {
  input: GroupMessageInput;
};


export type MutationSendScheduleDatesArgs = {
  input: SendScheduleDatesInput;
};


export type MutationVoteArgs = {
  value: Scalars['Int'];
  postId: Scalars['Int'];
};


export type MutationCreatePostArgs = {
  details: CreatePostDetails;
};


export type MutationUpdatePostArgs = {
  content: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationCreateCommentArgs = {
  input: CreateCommentDetails;
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['Int'];
  postId: Scalars['Int'];
};


export type MutationUpdateCommentArgs = {
  content: Scalars['String'];
  commentId: Scalars['Int'];
  postId: Scalars['Int'];
};


export type MutationEditModeArgs = {
  commentId: Scalars['Int'];
  postId: Scalars['Int'];
};


export type MutationVoteCommentArgs = {
  commentId: Scalars['Int'];
  value: Scalars['Int'];
  postId: Scalars['Int'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  posts: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Float'];
  creatorId: Scalars['Float'];
  creator: User;
  module_id?: Maybe<Scalars['Int']>;
  points: Scalars['Float'];
  voteStatus?: Maybe<Scalars['Int']>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title: Scalars['String'];
  content: Scalars['String'];
  textSnippet: Scalars['String'];
  module?: Maybe<Module>;
  comments: Array<Comment>;
};


export type PostCommentsArgs = {
  postID: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  user?: Maybe<User>;
  group?: Maybe<Group>;
  myGroups: Array<Group>;
  groups: Array<Group>;
  getScheduleDates: Array<GroupSchedule>;
  hey: Scalars['String'];
  modules: Array<Module>;
  posts: PaginatedPosts;
  post?: Maybe<Post>;
  comment?: Maybe<Comment>;
};


export type QueryUserArgs = {
  userId: Scalars['Int'];
};


export type QueryGroupArgs = {
  slug: Scalars['String'];
};


export type QueryMyGroupsArgs = {
  moduleId: Scalars['Int'];
};


export type QueryGroupsArgs = {
  moduleId: Scalars['Int'];
};


export type QueryGetScheduleDatesArgs = {
  input: GetScheduleDatesInput;
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  moduleId: Scalars['Int'];
  limit: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryCommentArgs = {
  commentId: Scalars['Int'];
};

export type RegisterInput = {
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
  displayName: Scalars['String'];
};

export type ReplyInviteInput = {
  groupId: Scalars['Int'];
  accept: Scalars['Boolean'];
};

export type ReplyRequestInput = {
  groupId: Scalars['Int'];
  userId: Scalars['Int'];
  accept: Scalars['Boolean'];
};

export type ResetPasswordInput = {
  token: Scalars['String'];
  password: Scalars['String'];
};

export type SendScheduleDatesInput = {
  groupId: Scalars['Int'];
  remove: Array<Scalars['DateTime']>;
  add: Array<Scalars['DateTime']>;
};

export type Status = {
  __typename?: 'Status';
  message: Scalars['String'];
  success: Scalars['Boolean'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newGroupMessage: GroupMessage;
};


export type SubscriptionNewGroupMessageArgs = {
  groupId: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  editMode: Scalars['Boolean'];
  isVerified: Scalars['Boolean'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  username: Scalars['String'];
  displayName: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type CommentSnippetFragment = (
  { __typename?: 'Comment' }
  & Pick<Comment, 'commentId' | 'postId' | 'points' | 'voteStatus' | 'creatorId'>
);

export type ErrorDetailsFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type PostSnippetFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'points' | 'voteStatus' | 'textSnippet'>
  & { module?: Maybe<(
    { __typename?: 'Module' }
    & Pick<Module, 'id' | 'name' | 'code'>
  )>, creator: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ) }
);

export type StatusResponseFragment = (
  { __typename?: 'Status' }
  & Pick<Status, 'message' | 'success'>
);

export type UserDetailsFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'displayName'>
);

export type CreateCommentMutationVariables = Exact<{
  input: CreateCommentDetails;
}>;


export type CreateCommentMutation = (
  { __typename?: 'Mutation' }
  & { createComment: (
    { __typename?: 'Comment' }
    & Pick<Comment, 'postId' | 'commentId' | 'creatorId' | 'content'>
  ) }
);

export type CreateGroupMutationVariables = Exact<{
  details: GroupCreationInput;
}>;


export type CreateGroupMutation = (
  { __typename?: 'Mutation' }
  & { createGroup: (
    { __typename?: 'GroupResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorDetailsFragment
    )>>, group?: Maybe<(
      { __typename?: 'Group' }
      & Pick<Group, 'id' | 'name' | 'description' | 'requirements' | 'module_id' | 'is_private' | 'slug'>
    )> }
  ) }
);

export type CreatePostMutationVariables = Exact<{
  details: CreatePostDetails;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'content' | 'points' | 'creatorId'>
  ) }
);

export type DeleteCommentMutationVariables = Exact<{
  postId: Scalars['Int'];
  commentId: Scalars['Int'];
}>;


export type DeleteCommentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteComment'>
);

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type DisbandGroupMutationVariables = Exact<{
  groupId: Scalars['Int'];
}>;


export type DisbandGroupMutation = (
  { __typename?: 'Mutation' }
  & { disbandGroup: (
    { __typename?: 'Status' }
    & StatusResponseFragment
  ) }
);

export type EditGroupMutationVariables = Exact<{
  input: GroupEditInput;
}>;


export type EditGroupMutation = (
  { __typename?: 'Mutation' }
  & { editGroup: (
    { __typename?: 'Status' }
    & StatusResponseFragment
  ) }
);

export type EditModeMutationVariables = Exact<{
  postId: Scalars['Int'];
  commentId: Scalars['Int'];
}>;


export type EditModeMutation = (
  { __typename?: 'Mutation' }
  & { editMode?: Maybe<(
    { __typename?: 'Comment' }
    & Pick<Comment, 'postId' | 'commentId' | 'editMode'>
  )> }
);

export type EditUserMutationVariables = Exact<{
  displayName: Scalars['String'];
  description: Scalars['String'];
  email: Scalars['String'];
  userId: Scalars['Int'];
}>;


export type EditUserMutation = (
  { __typename?: 'Mutation' }
  & { editUser: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorDetailsFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
    )> }
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type InviteByUserNameMutationVariables = Exact<{
  input: InviteToGroupByUserInput;
}>;


export type InviteByUserNameMutation = (
  { __typename?: 'Mutation' }
  & { inviteToGroupByUsername: (
    { __typename?: 'Status' }
    & StatusResponseFragment
  ) }
);

export type LeaveGroupMutationVariables = Exact<{
  groupId: Scalars['Int'];
}>;


export type LeaveGroupMutation = (
  { __typename?: 'Mutation' }
  & { leaveGroup: (
    { __typename?: 'Status' }
    & StatusResponseFragment
  ) }
);

export type LoginMutationVariables = Exact<{
  emailOrUsername: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorDetailsFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & UserDetailsFragment
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  displayName: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorDetailsFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & UserDetailsFragment
    )> }
  ) }
);

export type ReplyInviteMutationVariables = Exact<{
  input: ReplyInviteInput;
}>;


export type ReplyInviteMutation = (
  { __typename?: 'Mutation' }
  & { replyInvite: (
    { __typename?: 'Status' }
    & StatusResponseFragment
  ) }
);

export type ReplyRequestMutationVariables = Exact<{
  input: ReplyRequestInput;
}>;


export type ReplyRequestMutation = (
  { __typename?: 'Mutation' }
  & { replyRequest: (
    { __typename?: 'Status' }
    & StatusResponseFragment
  ) }
);

export type RequestToGroupMutationVariables = Exact<{
  groupId: Scalars['Int'];
}>;


export type RequestToGroupMutation = (
  { __typename?: 'Mutation' }
  & { requestToGroup: (
    { __typename?: 'Status' }
    & StatusResponseFragment
  ) }
);

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & { resetPassword: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorDetailsFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & UserDetailsFragment
    )> }
  ) }
);

export type SendScheduleDatesMutationVariables = Exact<{
  input: SendScheduleDatesInput;
}>;


export type SendScheduleDatesMutation = (
  { __typename?: 'Mutation' }
  & { sendScheduleDates: (
    { __typename?: 'Status' }
    & Pick<Status, 'message' | 'success'>
  ) }
);

export type ToggleEditMutationVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type ToggleEditMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'toggleEdit'>
);

export type UpdateCommentMutationVariables = Exact<{
  postId: Scalars['Int'];
  commentId: Scalars['Int'];
  content: Scalars['String'];
}>;


export type UpdateCommentMutation = (
  { __typename?: 'Mutation' }
  & { updateComment?: Maybe<(
    { __typename?: 'Comment' }
    & Pick<Comment, 'postId' | 'commentId' | 'content'>
  )> }
);

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'content' | 'textSnippet'>
  )> }
);

export type VerificationEmailMutationVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type VerificationEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'verificationEmail'>
);

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type VerifyEmailMutation = (
  { __typename?: 'Mutation' }
  & { verifyEmail: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorDetailsFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & UserDetailsFragment
    )> }
  ) }
);

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  postId: Scalars['Int'];
}>;


export type VoteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'vote'>
);

export type VoteCommentMutationVariables = Exact<{
  value: Scalars['Int'];
  postId: Scalars['Int'];
  commentId: Scalars['Int'];
}>;


export type VoteCommentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'voteComment'>
);

export type WriteMessageMutationVariables = Exact<{
  input: GroupMessageInput;
}>;


export type WriteMessageMutation = (
  { __typename?: 'Mutation' }
  & { writeMessage: (
    { __typename?: 'GroupMessage' }
    & Pick<GroupMessage, 'id' | 'createdAt' | 'updatedAt' | 'message'>
    & { creator: (
      { __typename?: 'User' }
      & UserDetailsFragment
    ) }
  ) }
);

export type GetScheduleDatesQueryVariables = Exact<{
  input: GetScheduleDatesInput;
}>;


export type GetScheduleDatesQuery = (
  { __typename?: 'Query' }
  & { getScheduleDates: Array<(
    { __typename?: 'GroupSchedule' }
    & Pick<GroupSchedule, 'user_id' | 'group_id' | 'timestamp'>
  )> }
);

export type GroupQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type GroupQuery = (
  { __typename?: 'Query' }
  & { group?: Maybe<(
    { __typename?: 'Group' }
    & Pick<Group, 'id' | 'name' | 'description' | 'requirements' | 'slug' | 'is_private' | 'isMember' | 'isLeader' | 'invite'>
    & { module?: Maybe<(
      { __typename?: 'Module' }
      & Pick<Module, 'id' | 'name' | 'code'>
    )>, requests: Array<(
      { __typename?: 'User' }
      & UserDetailsFragment
    )>, members: Array<(
      { __typename?: 'User' }
      & UserDetailsFragment
    )>, messages: Array<(
      { __typename?: 'GroupMessage' }
      & Pick<GroupMessage, 'id' | 'createdAt' | 'updatedAt' | 'message'>
      & { creator: (
        { __typename?: 'User' }
        & UserDetailsFragment
      ) }
    )> }
  )> }
);

export type GroupsQueryVariables = Exact<{
  moduleId: Scalars['Int'];
}>;


export type GroupsQuery = (
  { __typename?: 'Query' }
  & { groups: Array<(
    { __typename?: 'Group' }
    & Pick<Group, 'id' | 'name' | 'description' | 'requirements' | 'slug' | 'isMember' | 'isLeader'>
    & { module?: Maybe<(
      { __typename?: 'Module' }
      & Pick<Module, 'id' | 'name' | 'code'>
    )> }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserDetailsFragment
  )> }
);

export type ModulesQueryVariables = Exact<{ [key: string]: never; }>;


export type ModulesQuery = (
  { __typename?: 'Query' }
  & { modules: Array<(
    { __typename?: 'Module' }
    & Pick<Module, 'id' | 'code' | 'name'>
  )> }
);

export type MyGroupsQueryVariables = Exact<{
  moduleId: Scalars['Int'];
}>;


export type MyGroupsQuery = (
  { __typename?: 'Query' }
  & { myGroups: Array<(
    { __typename?: 'Group' }
    & Pick<Group, 'id' | 'name' | 'description' | 'requirements' | 'slug' | 'isMember' | 'isLeader'>
    & { module?: Maybe<(
      { __typename?: 'Module' }
      & Pick<Module, 'id' | 'name' | 'code'>
    )> }
  )> }
);

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'points' | 'content' | 'voteStatus' | 'textSnippet' | 'module_id'>
    & { creator: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ), comments: Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'content' | 'commentId' | 'editMode' | 'postId' | 'points' | 'voteStatus' | 'creatorId' | 'createdAt' | 'updatedAt'>
      & { creator: (
        { __typename?: 'User' }
        & Pick<User, 'displayName'>
      ) }
    )> }
  )> }
);

export type PostsQueryVariables = Exact<{
  module_id: Scalars['Int'];
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & PostSnippetFragment
    )> }
  ) }
);

export type UserQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'displayName' | 'username' | 'editMode' | 'isVerified' | 'id' | 'description' | 'email'>
  )> }
);

export type NewGroupMessageSubscriptionVariables = Exact<{
  groupId: Scalars['Int'];
}>;


export type NewGroupMessageSubscription = (
  { __typename?: 'Subscription' }
  & { newGroupMessage: (
    { __typename?: 'GroupMessage' }
    & Pick<GroupMessage, 'id' | 'createdAt' | 'updatedAt' | 'message'>
    & { creator: (
      { __typename?: 'User' }
      & UserDetailsFragment
    ) }
  ) }
);

export const CommentSnippetFragmentDoc = gql`
    fragment CommentSnippet on Comment {
  commentId
  postId
  points
  voteStatus
  creatorId
}
    `;
export const ErrorDetailsFragmentDoc = gql`
    fragment ErrorDetails on FieldError {
  field
  message
}
    `;
export const PostSnippetFragmentDoc = gql`
    fragment PostSnippet on Post {
  id
  createdAt
  updatedAt
  title
  points
  voteStatus
  textSnippet
  module {
    id
    name
    code
  }
  creator {
    id
    username
  }
}
    `;
export const StatusResponseFragmentDoc = gql`
    fragment StatusResponse on Status {
  message
  success
}
    `;
export const UserDetailsFragmentDoc = gql`
    fragment UserDetails on User {
  id
  username
  displayName
}
    `;
export const CreateCommentDocument = gql`
    mutation CreateComment($input: CreateCommentDetails!) {
  createComment(input: $input) {
    postId
    commentId
    creatorId
    content
  }
}
    `;

export function useCreateCommentMutation() {
  return Urql.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument);
};
export const CreateGroupDocument = gql`
    mutation CreateGroup($details: GroupCreationInput!) {
  createGroup(input: $details) {
    errors {
      ...ErrorDetails
    }
    group {
      id
      name
      description
      requirements
      module_id
      is_private
      slug
    }
  }
}
    ${ErrorDetailsFragmentDoc}`;

export function useCreateGroupMutation() {
  return Urql.useMutation<CreateGroupMutation, CreateGroupMutationVariables>(CreateGroupDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($details: CreatePostDetails!) {
  createPost(details: $details) {
    id
    createdAt
    updatedAt
    title
    content
    points
    creatorId
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeleteCommentDocument = gql`
    mutation DeleteComment($postId: Int!, $commentId: Int!) {
  deleteComment(postId: $postId, commentId: $commentId)
}
    `;

export function useDeleteCommentMutation() {
  return Urql.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($id: Int!) {
  deletePost(id: $id)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const DisbandGroupDocument = gql`
    mutation DisbandGroup($groupId: Int!) {
  disbandGroup(groupId: $groupId) {
    ...StatusResponse
  }
}
    ${StatusResponseFragmentDoc}`;

export function useDisbandGroupMutation() {
  return Urql.useMutation<DisbandGroupMutation, DisbandGroupMutationVariables>(DisbandGroupDocument);
};
export const EditGroupDocument = gql`
    mutation EditGroup($input: GroupEditInput!) {
  editGroup(input: $input) {
    ...StatusResponse
  }
}
    ${StatusResponseFragmentDoc}`;

export function useEditGroupMutation() {
  return Urql.useMutation<EditGroupMutation, EditGroupMutationVariables>(EditGroupDocument);
};
export const EditModeDocument = gql`
    mutation EditMode($postId: Int!, $commentId: Int!) {
  editMode(postId: $postId, commentId: $commentId) {
    postId
    commentId
    editMode
  }
}
    `;

export function useEditModeMutation() {
  return Urql.useMutation<EditModeMutation, EditModeMutationVariables>(EditModeDocument);
};
export const EditUserDocument = gql`
    mutation EditUser($displayName: String!, $description: String!, $email: String!, $userId: Int!) {
  editUser(
    displayName: $displayName
    description: $description
    email: $email
    userId: $userId
  ) {
    errors {
      ...ErrorDetails
    }
    user {
      id
    }
  }
}
    ${ErrorDetailsFragmentDoc}`;

export function useEditUserMutation() {
  return Urql.useMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const InviteByUserNameDocument = gql`
    mutation InviteByUserName($input: InviteToGroupByUserInput!) {
  inviteToGroupByUsername(input: $input) {
    ...StatusResponse
  }
}
    ${StatusResponseFragmentDoc}`;

export function useInviteByUserNameMutation() {
  return Urql.useMutation<InviteByUserNameMutation, InviteByUserNameMutationVariables>(InviteByUserNameDocument);
};
export const LeaveGroupDocument = gql`
    mutation LeaveGroup($groupId: Int!) {
  leaveGroup(groupId: $groupId) {
    ...StatusResponse
  }
}
    ${StatusResponseFragmentDoc}`;

export function useLeaveGroupMutation() {
  return Urql.useMutation<LeaveGroupMutation, LeaveGroupMutationVariables>(LeaveGroupDocument);
};
export const LoginDocument = gql`
    mutation Login($emailOrUsername: String!, $password: String!) {
  login(input: {emailOrUsername: $emailOrUsername, password: $password}) {
    errors {
      ...ErrorDetails
    }
    user {
      ...UserDetails
    }
  }
}
    ${ErrorDetailsFragmentDoc}
${UserDetailsFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $displayName: String!, $password: String!) {
  register(
    input: {email: $email, username: $username, displayName: $displayName, password: $password}
  ) {
    errors {
      ...ErrorDetails
    }
    user {
      ...UserDetails
    }
  }
}
    ${ErrorDetailsFragmentDoc}
${UserDetailsFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const ReplyInviteDocument = gql`
    mutation ReplyInvite($input: ReplyInviteInput!) {
  replyInvite(input: $input) {
    ...StatusResponse
  }
}
    ${StatusResponseFragmentDoc}`;

export function useReplyInviteMutation() {
  return Urql.useMutation<ReplyInviteMutation, ReplyInviteMutationVariables>(ReplyInviteDocument);
};
export const ReplyRequestDocument = gql`
    mutation ReplyRequest($input: ReplyRequestInput!) {
  replyRequest(input: $input) {
    ...StatusResponse
  }
}
    ${StatusResponseFragmentDoc}`;

export function useReplyRequestMutation() {
  return Urql.useMutation<ReplyRequestMutation, ReplyRequestMutationVariables>(ReplyRequestDocument);
};
export const RequestToGroupDocument = gql`
    mutation RequestToGroup($groupId: Int!) {
  requestToGroup(groupId: $groupId) {
    ...StatusResponse
  }
}
    ${StatusResponseFragmentDoc}`;

export function useRequestToGroupMutation() {
  return Urql.useMutation<RequestToGroupMutation, RequestToGroupMutationVariables>(RequestToGroupDocument);
};
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $password: String!) {
  resetPassword(data: {token: $token, password: $password}) {
    errors {
      ...ErrorDetails
    }
    user {
      ...UserDetails
    }
  }
}
    ${ErrorDetailsFragmentDoc}
${UserDetailsFragmentDoc}`;

export function useResetPasswordMutation() {
  return Urql.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument);
};
export const SendScheduleDatesDocument = gql`
    mutation SendScheduleDates($input: SendScheduleDatesInput!) {
  sendScheduleDates(input: $input) {
    message
    success
  }
}
    `;

export function useSendScheduleDatesMutation() {
  return Urql.useMutation<SendScheduleDatesMutation, SendScheduleDatesMutationVariables>(SendScheduleDatesDocument);
};
export const ToggleEditDocument = gql`
    mutation ToggleEdit($userId: Int!) {
  toggleEdit(userId: $userId)
}
    `;

export function useToggleEditMutation() {
  return Urql.useMutation<ToggleEditMutation, ToggleEditMutationVariables>(ToggleEditDocument);
};
export const UpdateCommentDocument = gql`
    mutation UpdateComment($postId: Int!, $commentId: Int!, $content: String!) {
  updateComment(postId: $postId, commentId: $commentId, content: $content) {
    postId
    commentId
    content
  }
}
    `;

export function useUpdateCommentMutation() {
  return Urql.useMutation<UpdateCommentMutation, UpdateCommentMutationVariables>(UpdateCommentDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: Int!, $title: String!, $content: String!) {
  updatePost(id: $id, title: $title, content: $content) {
    id
    title
    content
    textSnippet
  }
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VerificationEmailDocument = gql`
    mutation VerificationEmail($userId: Int!) {
  verificationEmail(userId: $userId)
}
    `;

export function useVerificationEmailMutation() {
  return Urql.useMutation<VerificationEmailMutation, VerificationEmailMutationVariables>(VerificationEmailDocument);
};
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token) {
    errors {
      ...ErrorDetails
    }
    user {
      ...UserDetails
    }
  }
}
    ${ErrorDetailsFragmentDoc}
${UserDetailsFragmentDoc}`;

export function useVerifyEmailMutation() {
  return Urql.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument);
};
export const VoteDocument = gql`
    mutation Vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const VoteCommentDocument = gql`
    mutation VoteComment($value: Int!, $postId: Int!, $commentId: Int!) {
  voteComment(value: $value, postId: $postId, commentId: $commentId)
}
    `;

export function useVoteCommentMutation() {
  return Urql.useMutation<VoteCommentMutation, VoteCommentMutationVariables>(VoteCommentDocument);
};
export const WriteMessageDocument = gql`
    mutation WriteMessage($input: GroupMessageInput!) {
  writeMessage(input: $input) {
    id
    createdAt
    updatedAt
    creator {
      ...UserDetails
    }
    message
  }
}
    ${UserDetailsFragmentDoc}`;

export function useWriteMessageMutation() {
  return Urql.useMutation<WriteMessageMutation, WriteMessageMutationVariables>(WriteMessageDocument);
};
export const GetScheduleDatesDocument = gql`
    query GetScheduleDates($input: GetScheduleDatesInput!) {
  getScheduleDates(input: $input) {
    user_id
    group_id
    timestamp
  }
}
    `;

export function useGetScheduleDatesQuery(options: Omit<Urql.UseQueryArgs<GetScheduleDatesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetScheduleDatesQuery>({ query: GetScheduleDatesDocument, ...options });
};
export const GroupDocument = gql`
    query Group($slug: String!) {
  group(slug: $slug) {
    id
    name
    description
    requirements
    slug
    is_private
    isMember
    isLeader
    invite
    module {
      id
      name
      code
    }
    requests {
      ...UserDetails
    }
    members {
      ...UserDetails
    }
    messages {
      id
      createdAt
      updatedAt
      creator {
        ...UserDetails
      }
      message
    }
  }
}
    ${UserDetailsFragmentDoc}`;

export function useGroupQuery(options: Omit<Urql.UseQueryArgs<GroupQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GroupQuery>({ query: GroupDocument, ...options });
};
export const GroupsDocument = gql`
    query Groups($moduleId: Int!) {
  groups(moduleId: $moduleId) {
    id
    name
    description
    requirements
    slug
    isMember
    isLeader
    module {
      id
      name
      code
    }
  }
}
    `;

export function useGroupsQuery(options: Omit<Urql.UseQueryArgs<GroupsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GroupsQuery>({ query: GroupsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...UserDetails
  }
}
    ${UserDetailsFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const ModulesDocument = gql`
    query Modules {
  modules {
    id
    code
    name
  }
}
    `;

export function useModulesQuery(options: Omit<Urql.UseQueryArgs<ModulesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ModulesQuery>({ query: ModulesDocument, ...options });
};
export const MyGroupsDocument = gql`
    query MyGroups($moduleId: Int!) {
  myGroups(moduleId: $moduleId) {
    id
    name
    description
    requirements
    slug
    isMember
    isLeader
    module {
      id
      name
      code
    }
  }
}
    `;

export function useMyGroupsQuery(options: Omit<Urql.UseQueryArgs<MyGroupsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyGroupsQuery>({ query: MyGroupsDocument, ...options });
};
export const PostDocument = gql`
    query Post($id: Int!) {
  post(id: $id) {
    id
    createdAt
    updatedAt
    title
    points
    content
    voteStatus
    textSnippet
    module_id
    creator {
      id
      username
    }
    comments(postID: $id) {
      content
      commentId
      editMode
      postId
      points
      voteStatus
      creatorId
      createdAt
      updatedAt
      creator {
        displayName
      }
    }
  }
}
    `;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($module_id: Int!, $limit: Int!, $cursor: String) {
  posts(moduleId: $module_id, limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      ...PostSnippet
    }
  }
}
    ${PostSnippetFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};
export const UserDocument = gql`
    query User($userId: Int!) {
  user(userId: $userId) {
    displayName
    username
    editMode
    isVerified
    id
    description
    email
    editMode
  }
}
    `;

export function useUserQuery(options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserQuery>({ query: UserDocument, ...options });
};
export const NewGroupMessageDocument = gql`
    subscription NewGroupMessage($groupId: Int!) {
  newGroupMessage(groupId: $groupId) {
    id
    createdAt
    updatedAt
    creator {
      ...UserDetails
    }
    message
  }
}
    ${UserDetailsFragmentDoc}`;

export function useNewGroupMessageSubscription<TData = NewGroupMessageSubscription>(options: Omit<Urql.UseSubscriptionArgs<NewGroupMessageSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<NewGroupMessageSubscription, TData>) {
  return Urql.useSubscription<NewGroupMessageSubscription, TData, NewGroupMessageSubscriptionVariables>({ query: NewGroupMessageDocument, ...options }, handler);
};