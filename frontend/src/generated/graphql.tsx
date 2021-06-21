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
};

export type CreatePostDetails = {
  title: Scalars['String'];
  content: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
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
  members: Array<User>;
  requests: Array<GroupRequest>;
  invite?: Maybe<GroupInvite>;
};

export type GroupCreationInput = {
  name: Scalars['String'];
  description: Scalars['String'];
  requirements: Scalars['String'];
  moduleId: Scalars['Float'];
  isPrivate: Scalars['Boolean'];
};

export type GroupInfo = {
  __typename?: 'GroupInfo';
  id: Scalars['Int'];
  name: Scalars['String'];
  description: Scalars['String'];
  requirements: Scalars['String'];
  slug: Scalars['String'];
  isPrivate: Scalars['Boolean'];
  isMember: Scalars['Boolean'];
  module?: Maybe<Module>;
  isLeader?: Maybe<Scalars['Boolean']>;
  invite?: Maybe<GroupInvite>;
  requests?: Maybe<Array<GroupRequest>>;
  members?: Maybe<Array<User>>;
};

export type GroupInvite = {
  __typename?: 'GroupInvite';
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  user_id: Scalars['Int'];
  group_id: Scalars['Int'];
};

export type GroupRequest = {
  __typename?: 'GroupRequest';
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  user_id: Scalars['Int'];
  group_id: Scalars['Int'];
};

export type GroupResponse = {
  __typename?: 'GroupResponse';
  errors?: Maybe<Array<FieldError>>;
  group?: Maybe<Group>;
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
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  code: Scalars['String'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  resetPassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  vote: Scalars['Boolean'];
  createPost: Post;
  updatePost?: Maybe<Post>;
  deletePost: Scalars['Boolean'];
  leaveGroup: Status;
  replyRequest: Status;
  replyInvite: Status;
  requestToGroup: Status;
  inviteToGroupByUsername: Status;
  inviteToGroupById: Status;
  createGroup: GroupResponse;
};


export type MutationResetPasswordArgs = {
  data: ResetPasswordInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationVoteArgs = {
  value: Scalars['Int'];
  postId: Scalars['Int'];
};


export type MutationCreatePostArgs = {
  details: CreatePostDetails;
};


export type MutationUpdatePostArgs = {
  title?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Float'];
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


export type MutationCreateGroupArgs = {
  input: GroupCreationInput;
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
  points: Scalars['Float'];
  voteStatus?: Maybe<Scalars['Int']>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title: Scalars['String'];
  content: Scalars['String'];
  textSnippet: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  hey: Scalars['String'];
  me?: Maybe<User>;
  posts: PaginatedPosts;
  post?: Maybe<Post>;
  group?: Maybe<GroupInfo>;
  myGroups: Array<Group>;
  groups: Array<Group>;
  modules: Array<Module>;
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['Float'];
};


export type QueryGroupArgs = {
  slug: Scalars['String'];
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

export type Status = {
  __typename?: 'Status';
  message: Scalars['String'];
  success: Scalars['Boolean'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
  displayName: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type ErrorDetailsFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type PostSnippetFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'points' | 'voteStatus' | 'textSnippet'>
  & { creator: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ) }
);

export type UserDetailsFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
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

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
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

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  postId: Scalars['Int'];
}>;


export type VoteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'vote'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserDetailsFragment
  )> }
);

export type PostsQueryVariables = Exact<{
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
  creator {
    id
    username
  }
}
    `;
export const UserDetailsFragmentDoc = gql`
    fragment UserDetails on User {
  id
  username
}
    `;
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
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
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
export const VoteDocument = gql`
    mutation Vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
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
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
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