import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import CreateUrqlClient from "../utils/CreateUrqlClient";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import isServer from "../utils/isServer";
import NextLink from "next/link";
import React from "react";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery();
  const [{ data: me }] = useMeQuery({
    pause: isServer(),
  });

  return (
    <Layout variant="regular">
      <div>{`Welcome${
        me?.me ? ", " + me.me.username : ""
      }! Please follow for more updates! Feel free to test the login/register/reset password/forgot password functions`}</div>
      <br />
      <NextLink href="/create-post">
        <a> create post</a>
      </NextLink>
      <br />
      <NextLink href="/forum">
        <a> forum</a>
      </NextLink>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient, { ssr: false })(Index);
