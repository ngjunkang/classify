import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Link,
  Paper,
  Theme,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Delete, Edit } from "@material-ui/icons";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { UpvoteSection } from "../components/UpvoteSection";
import {
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from "../generated/graphql";
import CreateUrqlClient from "../utils/CreateUrqlClient";
import isServer from "../utils/isServer";
import { Typography } from "@material-ui/core";
import ModuleSelection from "../components/ModuleSelection";

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
    flexRowContent: {
      display: "flex",
      flexDirection: "row",
    },
    flexTime: {
      marginTop: 18,
      marginLeft: 5,
    },
    title: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    chip: {
      marginTop: 16,
      marginLeft: 10,
    },
  })
);

const Forum = () => {
  const router = useRouter();
  const styles = useStyles();
  const [variables, setVariables] = useState({
    limit: 5,
    cursor: null as null | string,
    module_id: 0,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  const [{ data: me }] = useMeQuery({
    pause: isServer(),
  });

  const [, deletePost] = useDeletePostMutation();
  const timeStampStringToString = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString("en", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };

  return (
    <Layout variant="regular">
      <Typography className={styles.title} variant="h2" color="primary">
        Whiteboard
      </Typography>
      <Box className={styles.flexBoxRight}>
        <NextLink href="/create-post">
          <Button> create post</Button>
        </NextLink>
      </Box>
      <ModuleSelection
        handleOnChange={(e, value) => {
          setVariables({
            limit: variables.limit,
            cursor: null,
            module_id: !value ? 0 : value.id,
          });
        }}
      />
      {!fetching && !data ? (
        <div>your get query failed for some reason</div>
      ) : fetching && !data ? (
        <div>Loading...</div>
      ) : (
        <Grid container spacing={2} direction="column">
          {data!.posts.posts.length <= 0 ? (
            <div>
              <text>no posts yet, create one!</text>
            </div>
          ) : (
            data!.posts.posts.map((p) =>
              !p ? null : (
                <Grid item xs={12}>
                  <Paper key={p.id} className={styles.flexBox} elevation={2}>
                    <UpvoteSection post={p} loggedIn={me?.me ? true : false} />
                    <Box className={styles.flexGrowContent}>
                      <Box className={styles.flexRowContent}>
                        <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                          <Link>
                            <h3>{p.title}</h3>
                          </Link>
                        </NextLink>
                        <Typography className={styles.flexTime} variant="body2">
                          at {timeStampStringToString(p.updatedAt)}
                        </Typography>
                        {p.module ? (
                          <Chip
                            className={styles.chip}
                            color="primary"
                            size="small"
                            label={p.module.code}
                          />
                        ) : null}
                      </Box>
                      <Typography variant="body2">{p.textSnippet}</Typography>
                    </Box>
                    {me?.me?.id !== p.creator.id ? null : (
                      <Box>
                        <IconButton
                          onClick={() => {
                            deletePost({ id: p.id });
                          }}
                        >
                          <Delete />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            router.push(`/post/chalk/${p.id}`);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              )
            )
          )}
        </Grid>
      )}
      {data && data.posts.hasMore ? (
        <Button
          onClick={() => {
            setVariables({
              limit: variables.limit,
              cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              module_id: variables.module_id,
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
