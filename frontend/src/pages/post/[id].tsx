import { Box, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import { useMeQuery, usePostQuery } from "../../generated/graphql";
import CreateUrqlClient from "../../utils/CreateUrqlClient";
import isServer from "../../utils/isServer";
import { postFromUrl } from "../../utils/postFromUrl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexBoxCol: {
      margin: 2,
      display: "",
      flexDirection: "column",
      alignItems: "center",
    },
    flexBoxRight: {
      margin: 2,
      justifyContent: "flex-end",
      display: "flex",
      flexDirection: "row",
      alignItems: "right",
    },
    flexBox: {
      display: "flex",
    },
    flexGrowContent: {
      flexGrow: 1,
    },
  })
);

const Post = ({}) => {
  const styles = useStyles();
  const [{ data, fetching }] = postFromUrl();
  if (fetching) {
    return (
      <Layout>
        <div> loading... </div>
      </Layout>
    );
  }
  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }
  return (
    <Layout>
      <text>
        Page is still under construction, but info from post is visible below:
      </text>
      <br />
      <h1>title: {data?.post?.title}</h1>
      <text>content: {data?.post?.content}</text>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient, { ssr: true })(Post);
