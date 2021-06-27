import {
  Box,
  Grid,
  IconButton,
  Link,
  Paper,
  Theme,
  Typography,
  Divider,
  Chip,
  Tooltip,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { GroupAdd, Edit, ExpandMoreRounded } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Group, useRequestToGroupMutation } from "../generated/graphql";
import CreateUrqlClient from "../utils/CreateUrqlClient";
import AlertSnackBar from "./misc/AlertSnackBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paddedBox: {
      padding: theme.spacing(2),
      position: "relative",
      textOverflow: "ellipsis",
    },
    preline: {
      whiteSpace: "pre-line",
    },
    groupName: {
      cursor: "pointer",
      fontWeight: "bold",
    },
    inheritFont: {
      fontFamily: "inherit",
    },
    expandMore: {
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      color: "#000000",
    },
    expandMoreBlock: {
      opacity: 0.8,
      backgroundColor: "#FFFFFF",
      position: "absolute",
      bottom: 0,
      width: "calc(100% - 32px)", // 2 * padding of paddedBox
    },
    groupHeight: {
      maxHeight: ({ height }: { height: boolean }) => (height ? "none" : 300),
    },
  })
);

interface GroupListItemProps {
  isLoading?: boolean;
}

const GroupListItem: React.FC<Partial<Group> & GroupListItemProps> = ({
  id,
  slug,
  name,
  description,
  requirements,
  module,
  isLeader,
  isMember,
  isLoading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const classes = useStyles({ height: isExpanded });

  const [height, setHeight] = useState(0);
  const elementRef = useRef(null);
  const [, requestToGroup] = useRequestToGroupMutation();
  const [status, setStatus] = useState({ success: false, message: "" });
  const [open, setOpen] = useState(false);

  // functions

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    setHeight(elementRef.current.clientHeight);
  });

  const handleExpandClick = () => setIsExpanded(true);

  let expandButton = (
    <Box className={classes.expandMoreBlock} onClick={handleExpandClick}>
      <IconButton className={classes.expandMore}>
        <ExpandMoreRounded />
      </IconButton>
    </Box>
  );

  if (isExpanded || height < 300 || isLoading) {
    expandButton = null;
  }

  let groupName = (
    <Typography variant="h4" className={classes.groupName}>
      <Skeleton />
    </Typography>
  );
  if (!isLoading) {
    groupName = (
      <NextLink href="/class/cliques/[slug]" as={`/class/cliques/${slug}`}>
        <Typography variant="h4" className={classes.groupName}>
          <Link color="inherit">{name}</Link>
        </Typography>
      </NextLink>
    );
  }

  let buttonSection = null;
  if (isLeader) {
    buttonSection = (
      <NextLink href="/class/cliques/[slug]" as={`/class/cliques/${slug}`}>
        <Tooltip title="Edit">
          <IconButton color="primary">
            <Edit />
          </IconButton>
        </Tooltip>
      </NextLink>
    );
  } else if (!isMember) {
    const handleRequestToGroup = async () => {
      const { data, error } = await requestToGroup({ groupId: id });
      if (!error) {
        setStatus({
          message: data.requestToGroup.message,
          success: data.requestToGroup.success,
        });
        setOpen(true);
      }
    };
    buttonSection = (
      <Tooltip title="Request to Group">
        <IconButton color="primary" onClick={handleRequestToGroup}>
          <GroupAdd />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Grid xs={12} item>
      <Paper>
        <Box className={classes.paddedBox}>
          <Box
            overflow="hidden"
            className={classes.groupHeight}
            {...{ ref: elementRef }}
          >
            <Grid container direction="column" spacing={2}>
              <Grid container item xs={12}>
                <Grid item>{groupName}</Grid>
                {!isLoading && <Grid item>{buttonSection}</Grid>}
              </Grid>
              {module && (
                <Grid item xs={12}>
                  <Chip color="primary" size="small" label={module.code} />
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="h5">Description</Typography>
                <Divider />
                <Typography className={classes.preline}>
                  {isLoading ? <Skeleton /> : description ? description : "NIL"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Requirements</Typography>
                <Divider />
                <Typography className={classes.preline}>
                  {isLoading ? (
                    <Skeleton />
                  ) : requirements ? (
                    requirements
                  ) : (
                    "NIL"
                  )}
                </Typography>
              </Grid>
              {expandButton}
            </Grid>
          </Box>
        </Box>
        <AlertSnackBar {...status} handleClose={handleClose} open={open} />
      </Paper>
    </Grid>
  );
};

export default withUrqlClient(CreateUrqlClient)(GroupListItem);
