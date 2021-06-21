import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import CreateUrqlClient from "../utils/CreateUrqlClient";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import isServer from "../utils/isServer";
import React, { useState } from "react";
import {
  Button,
  Container,
  Box,
  Paper,
  Grid,
  Theme,
  IconButton,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Delete,
  Edit,
  TrendingUpRounded,
} from "@material-ui/icons";
import NextLink from "next/link";
import { UpvoteSection } from "../components/UpvoteSection";

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

const Forum = () => {
  const styles = useStyles();
  const [variables, setVariables] = useState({
    limit: 2,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  const [{ data: me }] = useMeQuery({
    pause: isServer(),
  });

  return (
    <Layout variant="regular">
      <div>{`Welcome${
        me?.me ? ", " + me.me.username : ""
      }! Please follow for more updates! Feel free to test the login/register/reset password/forgot password functions`}</div>
      <br />
      <Container key="contain it">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => (
          <Button key={id}>Topic {id}</Button>
        ))}
        <Button> + </Button>
      </Container>
      <Box className={styles.flexBoxRight}>
        <NextLink href="/create-post">
          <Button> create post</Button>
        </NextLink>
      </Box>
      {!fetching && !data ? (
        <div>your get query failed for some reason</div>
      ) : fetching && !data ? (
        <div>Loading...</div>
      ) : (
        <Grid container spacing={2} direction="column">
          {data!.posts.posts.map((p) => (
            <Grid item xs={12}>
              <Paper key={p.id} className={styles.flexBox} elevation={2}>
                <UpvoteSection post={p} />
                <Box className={styles.flexGrowContent}>
                  <h3>{p.title}</h3>
                  <h4>{p.textSnippet}</h4>
                </Box>
                <Box>
                  <IconButton>
                    <Delete />
                  </IconButton>
                  <IconButton>
                    <Edit />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      {data && data.posts.hasMore ? (
        <Button
          onClick={() => {
            setVariables({
              limit: variables.limit,
              cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
            });
          }}
        >
          load more
        </Button>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient, { ssr: true })(Forum);
