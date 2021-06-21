import { Box, IconButton, Theme, Typography } from "@material-ui/core";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpvoteSectionProps {
  post: PostSnippetFragment;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexBoxCol: {
      margin: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    flexBox: {
      display: "flex",
    },
    flexGrowContent: {
      flexGrow: 1,
    },
    buttonRed: {
      backgroundColor: "red",
    },
    buttonGreen: {
      backgroundColor: "green",
    },
  })
);

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >("not-loading");
  const styles = useStyles();
  const [, vote] = useVoteMutation();
  return (
    <Box className={styles.flexBoxCol}>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("upvote-loading");
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState("not-loading");
        }}
        color={post.voteStatus === 1 ? "primary" : "default"}
      >
        <KeyboardArrowUp />
      </IconButton>
      <Typography>{post.points}</Typography>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("downvote-loading");
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState("not-loading");
        }}
        color={post.voteStatus === -1 ? "primary" : "default"}
      >
        <KeyboardArrowDown />
      </IconButton>
    </Box>
  );
};
