import { Box, IconButton, Typography, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import React, { useState } from "react";
import {
  CommentSnippetFragment,
  useVoteCommentMutation,
} from "../generated/graphql";

interface CommentUpvoteProps {
  comment: CommentSnippetFragment;
  loggedIn: boolean;
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
    flexBoxRow: {
      margin: 2,
      display: "flex",
      flexDirection: "row",
      alignItems: "left",
    },
    voteSpacing: {
      marginTop: 10,
    },
  })
);

export const CommentUpvote: React.FC<CommentUpvoteProps> = ({
  comment,
  loggedIn,
}) => {
  const styles = useStyles();
  const [, vote] = useVoteCommentMutation();
  return (
    <Box className={styles.flexBoxRow}>
      <IconButton
        onClick={async () => {
          await vote({
            postId: comment.postId,
            value: 1,
            commentId: comment.commentId,
          });
        }}
        color={loggedIn && comment.voteStatus === 1 ? "primary" : "default"}
      >
        <KeyboardArrowUp />
      </IconButton>
      <Box className={styles.voteSpacing}>
        <Typography>{comment.points}</Typography>
      </Box>
      <IconButton
        onClick={async () => {
          await vote({
            postId: comment.postId,
            value: -1,
            commentId: comment.commentId,
          });
        }}
        color={loggedIn && comment.voteStatus === -1 ? "primary" : "default"}
      >
        <KeyboardArrowDown />
      </IconButton>
    </Box>
  );
};
