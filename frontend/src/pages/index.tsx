import { Link, Typography } from "@material-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React from "react";
import Layout from "../components/Layout";
import { useMeQuery } from "../generated/graphql";
import CreateUrqlClient from "../utils/CreateUrqlClient";
import isServer from "../utils/isServer";

const Index = () => {
  const [{ data: me }] = useMeQuery({
    pause: isServer(),
  });

  return (
    <Layout variant="regular">
      <Typography>{`Welcome${
        me?.me ? ", " + me.me.username : ""
      }! Please follow for more updates! Feel free to test the whiteboard and the cliques features!`}</Typography>
      <br />

      <NextLink href="/whiteboard">
        <Link>Whiteboard</Link>
      </NextLink>
      <br />
      <NextLink href="/class/cliques">
        <Link>Cliques</Link>
      </NextLink>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient, { ssr: false })(Index);
