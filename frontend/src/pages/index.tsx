import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import CreateUrqlClient from "../utils/CreateUrqlClient";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import isServer from "../utils/isServer";
import NextLink from "next/link";
import React from "react";
import { Link } from "@material-ui/core";

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
        <Link>create post </Link>
      </NextLink>
      <br />
      <NextLink href="/forum">
        <Link> forum</Link>
      </NextLink>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient, { ssr: false })(Index);
