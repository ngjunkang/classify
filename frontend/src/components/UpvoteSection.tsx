import { Box, IconButton, Theme, Typography } from "@material-ui/core";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import {
  Post,
  PostSnippetFragment,
  useVoteMutation,
} from "../generated/graphql";

interface UpvoteSectionProps {
  post: PostSnippetFragment;
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
    buttonRed: {
      backgroundColor: "red",
    },
    buttonGreen: {
      backgroundColor: "green",
    },
  })
);

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({
  post,
  loggedIn,
}) => {
  const styles = useStyles();
  const [, vote] = useVoteMutation();
  return (
    <Box className={styles.flexBoxCol}>
      <IconButton
        onClick={async () => {
          await vote({
            postId: post.id,
            value: 1,
          });
        }}
        color={loggedIn && post.voteStatus === 1 ? "primary" : "default"}
      >
        <KeyboardArrowUp />
      </IconButton>
      <Typography>{post.points}</Typography>
      <IconButton
        onClick={async () => {
          await vote({
            postId: post.id,
            value: -1,
          });
        }}
        color={loggedIn && post.voteStatus === -1 ? "primary" : "default"}
      >
        <KeyboardArrowDown />
      </IconButton>
    </Box>
  );
};
