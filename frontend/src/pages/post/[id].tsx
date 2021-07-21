import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Link,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Delete, Edit, ExpandMore } from "@material-ui/icons";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { CommentUpvote } from "../../components/CommentUpvote";
import NextLink from "next/link";
import Layout from "../../components/Layout";
import LoadingButton from "../../components/LoadingButton";
import TextAreaField from "../../components/TextAreaField";
import { UpvoteSection } from "../../components/UpvoteSection";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useEditModeMutation,
  useMeQuery,
  useUpdateCommentMutation,
} from "../../generated/graphql";
import CreateUrqlClient from "../../utils/CreateUrqlClient";
import isServer from "../../utils/isServer";
import { postFromUrl } from "../../utils/postFromUrl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexBoxCol: {
      margin: 2,
      marginRight: 15,
      display: "",
      flexDirection: "column",
      flexGrow: 1,
      alignItems: "center",
    },
    upvote: {
      backgroundColor: "lightGrey",
    },
    flexBox: {
      display: "flex",
      flexGrow: 1,
    },
    flexButton: {
      marginTop: 15,
      color: "grey",
    },
    flexGrow: {
      marginTop: 10,
      flexGrow: 1,
      display: "flex",
      flexDirection: "row",
    },
    flexGrowContent: {
      flexGrow: 1,
      padding: 10,
    },
    flexGrowComment: {
      flexGrow: 1,
      paddingLeft: 10,
      paddingTop: 5,
    },
    flexRowComment: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    flexBoxRow: {
      margin: 2,
      display: "flex",
      flexDirection: "row",
      alignItems: "left",
    },
    flexButtons: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "row",
    },
    authorText: {
      display: "flex",
      flexDirection: "row",
      marginTop: 5,
    },
    authorSpacing: {
      marginTop: 5,
      marginLeft: 5,
      marginRight: 5,
    },
    button: {
      color: lightBlue[500],
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    titleSpacing: {
      marginLeft: 5,
    },
    textSpacing: {
      marginBottom: 5,
    },
    voteSpacing: {
      marginTop: 10,
    },
  })
);

const Post = ({}) => {
  const [display, changeDisplay] = useState(false);
  const router = useRouter();
  const styles = useStyles();
  const [{ data, fetching }] = postFromUrl();
  const [, toggleEdit] = useEditModeMutation();
  const [, createComment] = useCreateCommentMutation();
  const [, updateComment] = useUpdateCommentMutation();
  const [, deleteComment] = useDeleteCommentMutation();
  const postDate = data?.post?.updatedAt;
  const author = (
    <NextLink href="/profile/[id]" as={`/profile/${data?.post?.creator?.id}`}>
      <Link>
        <h3>{data?.post?.creator.username}</h3>
      </Link>
    </NextLink>
  );
  const [{ data: me }] = useMeQuery({
    pause: isServer(),
  });

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
      <Paper key={data?.post?.id} className={styles.flexBox} elevation={2}>
        <Box className={styles.upvote}>
          <UpvoteSection post={data?.post} loggedIn={me?.me ? true : false} />
        </Box>
        <Box className={styles.flexBoxCol}>
          <Box className={styles.flexGrowContent}>
            <Typography variant="h4" color="primary">
              {data?.post?.title}
            </Typography>
            <Box className={styles.flexRowComment}>
              <Typography className={styles.authorText} variant="body2">
                by
              </Typography>
              <NextLink
                href="/profile/[id]"
                as={`/profile/${data?.post?.creator?.id}`}
              >
                <Link className={styles.authorSpacing}>
                  <Typography variant="body2">
                    {data?.post?.creator.username}
                  </Typography>
                </Link>
              </NextLink>
              <Typography className={styles.authorText} variant="body2">
                at {timeStampStringToString(postDate)}
              </Typography>
            </Box>
          </Box>
          <Box className={styles.flexGrowContent}>
            <Typography variant="body1">{data?.post?.content}</Typography>
          </Box>
          <Box className={styles.flexGrowComment}>
            {!fetching && data.post.comments
              ? data.post.comments.map((c) => {
                  return (
                    <Box className={styles.flexBoxCol}>
                      <Divider />
                      <Box className={styles.flexGrow}>
                        {c.editMode ? (
                          <Box className={styles.flexGrowContent}>
                            <Formik
                              initialValues={{
                                postId: c.postId,
                                commentId: c.commentId,
                                content: c.content,
                              }}
                              onSubmit={async (update) => {
                                await updateComment({ ...update });
                                toggleEdit({
                                  postId: c.postId,
                                  commentId: c.commentId,
                                });
                              }}
                            >
                              {({ isSubmitting }) => (
                                <Form>
                                  <TextAreaField
                                    label="edit comment"
                                    name="content"
                                  />
                                  <Box className={styles.flexBoxRow}>
                                    <Button
                                      className={styles.flexButton}
                                      onClick={() => {
                                        toggleEdit({
                                          postId: c.postId,
                                          commentId: c.commentId,
                                        });
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <LoadingButton
                                      isLoading={isSubmitting}
                                      type="submit"
                                    >
                                      Edit Comment
                                    </LoadingButton>
                                  </Box>
                                </Form>
                              )}
                            </Formik>
                          </Box>
                        ) : (
                          <Box
                            key={c.commentId}
                            className={styles.flexGrowComment}
                          >
                            <Box className={styles.flexRowComment}>
                              <NextLink
                                href="/profile/[id]"
                                as={`/profile/${data?.post?.creator?.id}`}
                              >
                                <Link>
                                  <Typography variant="body2" color="initial">
                                    {c.creator.displayName}
                                  </Typography>
                                </Link>
                              </NextLink>
                              <Typography
                                className={styles.titleSpacing}
                                variant="body2"
                                color="initial"
                              >
                                at {timeStampStringToString(c.updatedAt)}
                              </Typography>
                            </Box>
                            <Typography
                              className={styles.voteSpacing}
                              variant="body1"
                            >
                              {c.content}
                            </Typography>
                          </Box>
                        )}
                        {c.editMode || me?.me?.id !== c.creatorId ? null : (
                          <Box>
                            <IconButton
                              onClick={() => {
                                deleteComment({
                                  postId: c.postId,
                                  commentId: c.commentId,
                                });
                              }}
                            >
                              <Delete />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                toggleEdit({
                                  postId: c.postId,
                                  commentId: c.commentId,
                                });
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                      {c.editMode ? null : (
                        <CommentUpvote
                          comment={c}
                          loggedIn={me?.me ? true : false}
                        />
                      )}
                    </Box>
                  );
                })
              : null}
          </Box>
          <Box className={styles.flexBoxRow}>
            <Box className={styles.flexButtons}>
              <Button
                className={styles.button}
                onClick={() => router.push("/whiteboard")}
              >
                Back to Whiteboard
              </Button>
            </Box>
            <Box>
              <IconButton
                className={clsx(styles.expand, {
                  [styles.expandOpen]: display,
                })}
                onClick={() => changeDisplay(!display)}
              >
                <ExpandMore />
              </IconButton>
            </Box>
          </Box>
          <Collapse in={display} timeout="auto" unmountOnExit>
            <Box className={styles.flexGrowContent}>
              <Formik
                initialValues={{
                  postId: data.post.id,
                  content: "",
                }}
                onSubmit={async (data, { resetForm }) => {
                  await createComment({ input: data });
                  resetForm();
                }}
              >
                {({ isSubmitting, resetForm }) => (
                  <Form>
                    <TextAreaField label="write a comment" name="content" />
                    <Box className={styles.flexBoxRow}>
                      <Button
                        className={styles.flexButton}
                        onClick={() => resetForm()}
                      >
                        Cancel
                      </Button>
                      <LoadingButton isLoading={isSubmitting} type="submit">
                        Create Comment
                      </LoadingButton>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          </Collapse>
        </Box>
      </Paper>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient, { ssr: true })(Post);
