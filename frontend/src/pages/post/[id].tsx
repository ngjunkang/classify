import { Box, Button, Paper, Theme, Typography } from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";
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
      padding: 15,
    },
    flexBox: {
      display: "flex",
    },
    flexGrowContent: {
      flexGrow: 1,
      padding: 15,
    },
    button: {
      color: lightBlue[500],
    },
  })
);

const Post = ({}) => {
  const router = useRouter();
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
    <Layout variant="regular">
      <Paper key={data?.post?.id} className={styles.flexBoxCol} elevation={2}>
        <Box className={styles.flexGrowContent}>
          <Typography variant="h3" color="primary">
            {data?.post?.title}
          </Typography>
          <text>
            {data?.post?.creator ? `by ${data?.post?.creator.username}` : null}
          </text>
        </Box>
        <Box className={styles.flexGrowContent}>
          <Typography variant="body1">{data?.post?.content}</Typography>
        </Box>
        <Box>
          <Button
            className={styles.button}
            onClick={() => router.push("/whiteboard")}
          >
            Back to Whiteboard
          </Button>
        </Box>
      </Paper>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient, { ssr: true })(Post);
