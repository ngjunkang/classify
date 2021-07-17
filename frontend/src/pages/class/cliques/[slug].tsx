import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Theme,
  Typography,
} from "@material-ui/core";
import { createStyles, fade, makeStyles } from "@material-ui/core/styles";
import { AccessTime, Add, Done, Send } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CheckBoxField from "../../../components/CheckBoxField";
import Layout from "../../../components/Layout";
import LoadingButton from "../../../components/LoadingButton";
import AlertSnackBar from "../../../components/misc/AlertSnackBar";
import ConfirmationDialog from "../../../components/misc/ConfirmationDialog";
import DataLoadingError from "../../../components/misc/DataLoadingError";
import ModuleSelection from "../../../components/ModuleSelection";
import StandardTextField from "../../../components/StandardTextField";
import StyledTab from "../../../components/tab/StyledTab";
import StyledTabs from "../../../components/tab/StyledTabs";
import TabPanel from "../../../components/tab/TabPanel";
import TextAreaField from "../../../components/TextAreaField";
import {
  useDisbandGroupMutation,
  useEditGroupMutation,
  useGroupQuery,
  useInviteByUserNameMutation,
  useLeaveGroupMutation,
  useMeQuery,
  useNewGroupMessageSubscription,
  useReplyInviteMutation,
  useReplyRequestMutation,
  useRequestToGroupMutation,
  useWriteMessageMutation,
} from "../../../generated/graphql";
import CreateUrqlClient from "../../../utils/CreateUrqlClient";

interface CliquePageProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    root: {
      flexGrow: 1,
    },
    padding: {
      padding: theme.spacing(3),
    },
    preline: {
      whiteSpace: "pre-line",
    },
    requestButton: {
      margin: theme.spacing(2, 0, 2, 2),
      marginLeft: "auto",
    },
    leaveGroup: {
      backgroundColor: "#b51300",
      color: "#fff",
    },
    messageSection: {
      height: "calc(100vh - 395px)",
      display: "flex",
      flexDirection: "column",
    },
    messageInput: {
      padding: theme.spacing(2),
    },
    messages: {
      flexGrow: 1,
      overflowY: "auto",
    },
    container: {
      bottom: 0,
    },
    bubbleContainer: {
      width: "100%",
      display: "flex",
    },
    bubble: {
      // border: "1.5px solid black",
      borderRadius: "10px",
      padding: "10px",
      backgroundColor: theme.palette.primary.light,
      display: "inline-block",
      maxWidth: "95%",
    },
    right: {
      justifyContent: "flex-end",
    },
    left: {
      justifyContent: "flex-start",
    },
    inline: {
      display: "inline",
      fontWeight: "bold",
    },
    center: {
      display: "flex",
      flexGrow: 1,
      padding: theme.spacing(2),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: fade(theme.palette.background.default, 0.15),
    },
  })
);

const a11yProps = (index: any) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const CliquePage: React.FC<CliquePageProps> = ({}) => {
  const router = useRouter();

  // hooks
  const [{ data, fetching }] = useGroupQuery({
    variables: {
      slug: typeof router.query?.slug === "string" ? router.query.slug : "",
    },
  });
  const [{ data: me, fetching: meFetch }] = useMeQuery();

  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [, replyInvite] = useReplyInviteMutation();
  const [, replyRequest] = useReplyRequestMutation();
  const [, requestToGroup] = useRequestToGroupMutation();
  const [, editGroup] = useEditGroupMutation();
  const [, inviteByUsername] = useInviteByUserNameMutation();
  const [, leaveGroup] = useLeaveGroupMutation();
  const [, disbandGroup] = useDisbandGroupMutation();
  const [, writeMessage] = useWriteMessageMutation();
  const [GROUP_ID, setGROUP_ID] = useState(0);
  useNewGroupMessageSubscription(
    {
      variables: { groupId: GROUP_ID },
      pause: GROUP_ID === 0,
    },
    (_, res) => {
      return res;
    }
  );

  const [status, setStatus] = useState({ success: false, message: "" });
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (!meFetch && !me?.me) {
      setValue(0);
    }
  }, [me]);

  useEffect(() => {
    if (data?.group?.isMember) {
      setGROUP_ID(data.group.id);
    }
  }, [data?.group?.id]);

  // functions
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  if (fetching) {
    return (
      <Backdrop className={classes.backdrop} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (!fetching && (!data || (data && !data.group))) {
    router.push("/class/cliques");
    return null;
  }

  // group exists

  // destructure
  const {
    id,
    name,
    description,
    requirements,
    slug,
    is_private,
    isMember,
    isLeader,
    module,
    invite,
    requests,
    members,
    messages,
  } = data.group;

  // functions
  const getInitials = (name: string): string => {
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  // members
  let membersSection = null;
  if (!meFetch && me?.me && isMember) {
    membersSection = (
      <>
        <Grid xs={12} item>
          <Typography variant="h5">Members</Typography>
          <Divider />
          <Grid container justify="flex-start">
            {members.map((member) => {
              return (
                <Grid item xs={6} key={member.id}>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>{getInitials(member.displayName)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            {member.displayName}
                          </Typography>
                        }
                      ></ListItemText>
                    </ListItem>
                  </List>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid xs={12} item>
          <Button
            className={classes.leaveGroup}
            onClick={() => setOpenDialog(true)}
          >
            Leave Clique
          </Button>
          <ConfirmationDialog
            handleProceed={async () => {
              setOpenDialog(false);
              const { data, error } = await leaveGroup({ groupId: id });
              if (!error) {
                setStatus({
                  message: data.leaveGroup.message,
                  success: data.leaveGroup.success,
                });
                setOpen(true);
              }
            }}
            handleClose={() => setOpenDialog(false)}
            open={openDialog}
            dialogTitle={`Leave ${name}?`}
            diaglogContent="Are you sure you wanna leave?"
            dialogCancelBtnTitle="Cancel"
            dialogProceedBtnTitle="Leave"
          />
        </Grid>
      </>
    );
  }

  // request for leader
  const handleReplyRequests = async (accept: boolean, userId: number) => {
    const { data, error } = await replyRequest({
      input: { accept: accept, groupId: id, userId: userId },
    });
    if (!error) {
      setStatus({
        message: data.replyRequest.message,
        success: data.replyRequest.success,
      });
      setOpen(true);
    }
  };

  let requestSection = null;
  if (isLeader && requests.length > 0) {
    requestSection = (
      <Grid item xs={12}>
        <Grid container direction="column" spacing={1}>
          {requests.map((request) => {
            return (
              <Grid item xs={12}>
                <Alert
                  key={request.id}
                  severity="info"
                  action={
                    <>
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => handleReplyRequests(true, request.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => handleReplyRequests(false, request.id)}
                      >
                        Decline
                      </Button>
                    </>
                  }
                >
                  {`${request.displayName} has requested to join!`}
                </Alert>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    );
  }

  // request to group
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

  let requestToGroupSection = null;
  if (!isMember || (!meFetch && !me?.me)) {
    requestToGroupSection = (
      <Button
        variant="contained"
        color="primary"
        className={classes.requestButton}
        startIcon={<Add />}
        onClick={handleRequestToGroup}
      >
        Request to Clique
      </Button>
    );
  }

  // invite from group
  const handleReplyInvite = async (accept: boolean) => {
    const { data, error } = await replyInvite({
      input: { accept: accept, groupId: id },
    });
    if (!error) {
      setStatus({
        message: data.replyInvite.message,
        success: data.replyInvite.success,
      });
      setOpen(true);
    }
  };

  let inviteSection = null;
  if (!isMember && invite) {
    inviteSection = (
      <Grid item xs={12}>
        <Alert
          severity="info"
          action={
            <>
              <Button
                color="inherit"
                size="small"
                onClick={() => handleReplyInvite(true)}
              >
                Accept
              </Button>
              <Button
                color="inherit"
                size="small"
                onClick={() => handleReplyInvite(false)}
              >
                Decline
              </Button>
            </>
          }
        >
          You are invited!!
        </Alert>
      </Grid>
    );
  }

  // info
  const infoTab = (
    <TabPanel value={value} index={0}>
      <Grid container spacing={2}>
        {inviteSection}
        {requestSection}
        <Grid item xs={12}>
          <Typography variant="h5">Description</Typography>
          <Divider />
          <Typography className={classes.preline}>
            {description ? description : "NIL"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Requirements</Typography>
          <Divider />
          <Typography className={classes.preline}>
            {requirements ? requirements : "NIL"}
          </Typography>
        </Grid>
        {module && (
          <Grid item xs={12}>
            <Typography variant="h5">Module</Typography>
            <Divider />
            <Typography className={classes.preline}>
              {`${module.name} (${module.code})`}
            </Typography>
          </Grid>
        )}
        {membersSection}
      </Grid>
    </TabPanel>
  );

  // messages
  const timeStampStringToString = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString("en", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    });
  };

  let messageSection = null;
  if (!meFetch && me?.me && isMember) {
    if (messages.length) {
      messageSection = (
        <Box
          className={classes.messages}
          display="flex"
          flexDirection="column-reverse"
        >
          <List>
            {isMember &&
              messages.map((message) => {
                const isMe = me?.me?.id === message.creator.id;
                return (
                  <ListItem
                    key={`${message.id} ${message.createdAt} ${Math.random()
                      .toString(36)
                      .substr(2, 9)}`}
                  >
                    <Box
                      className={`${classes.bubbleContainer} ${
                        isMe ? classes.right : classes.left
                      }`}
                    >
                      <Box className={classes.bubble}>
                        <ListItemText
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                              >
                                {isMe ? "Me" : message.creator.displayName}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                        <ListItemText primary={message.message} />
                        <Box
                          display="flex"
                          alignItems="center"
                          textAlign="right"
                        >
                          <ListItemText
                            secondary={timeStampStringToString(
                              message.createdAt
                            )}
                          />
                          {message.id ? <Done /> : <AccessTime />}
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                );
              })}
          </List>
        </Box>
      );
    } else {
      messageSection = (
        <DataLoadingError text="No messages yet" className={classes.center} />
      );
    }
  }

  let messageTab = null;
  messageTab = (
    <TabPanel value={value} index={1}>
      <Box className={classes.messageSection}>
        {messageSection}
        <Divider />

        <Formik
          initialValues={{
            message: "",
          }}
          onSubmit={async (data, { resetForm }) => {
            if (!data.message) {
              return;
            }

            resetForm();

            const { error } = await writeMessage({
              input: { groupId: id, message: data.message },
            });
            if (error?.message.includes("not authorised to group")) {
              setStatus({
                success: false,
                message: "Not authorised to send message!",
              });
              setOpen(true);
            } else if (error?.networkError) {
              setStatus({
                success: false,
                message: "Check your internet connection!",
              });
              setOpen(true);
            }
          }}
        >
          {() => {
            return (
              <Form>
                <Grid container spacing={2} className={classes.messageInput}>
                  <Grid item xs={11}>
                    <StandardTextField
                      label="Type your message here"
                      name="message"
                      optional
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Box mt={1}>
                      <Fab color="primary" aria-label="add" type="submit">
                        <Send />
                      </Fab>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </TabPanel>
  );

  // schedule
  let scheduleTab = null;
  scheduleTab = (
    <TabPanel value={value} index={2}>
      <Typography>Coming Soon</Typography>
    </TabPanel>
  );

  // edit info
  let editInfoSection = null;
  if (isLeader) {
    editInfoSection = (
      <Formik
        initialValues={{
          description: description,
          requirements: requirements,
          is_private: is_private,
          module_id: module ? module.id : 0,
        }}
        onSubmit={async (data) => {
          const { error, data: returnData } = await editGroup({
            input: { id: id, ...data },
          });

          if (!error) {
            setStatus({
              message: returnData.editGroup.message,
              success: returnData.editGroup.success,
            });
            setOpen(true);
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <TextAreaField
              label="Clique Description"
              name="description"
              optional
            />
            <TextAreaField
              label="Clique Requirements"
              name="requirements"
              optional
            />
            <ModuleSelection
              handleOnChange={(e, value) =>
                setFieldValue("module_id", !value ? 0 : value.id)
              }
              {...(module ? { initialValue: module } : null)}
            />
            <CheckBoxField
              name="is_private"
              label="Private Group (not listed)"
              defaultChecked={is_private}
            />

            <LoadingButton isLoading={isSubmitting} type="submit">
              Save
            </LoadingButton>
          </Form>
        )}
      </Formik>
    );
  }

  let inviteByUsernameSection = null;
  if (isLeader) {
    inviteByUsernameSection = (
      <Formik
        initialValues={{
          username: "",
        }}
        onSubmit={async ({ username }) => {
          const { error, data } = await inviteByUsername({
            input: { username: username, groupId: id },
          });

          if (!error) {
            setStatus({
              message: data.inviteToGroupByUsername.message,
              success: data.inviteToGroupByUsername.success,
            });
            setOpen(true);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <StandardTextField
              label="Username"
              name="username"
            ></StandardTextField>
            <LoadingButton isLoading={isSubmitting} type="submit">
              Invite
            </LoadingButton>
          </Form>
        )}
      </Formik>
    );
  }

  // settings
  const handleDisbandGroup = async () => {
    setOpenDialog(false);
    const { data, error } = await disbandGroup({ groupId: id });
    if (!error) {
      setStatus({
        message: data.disbandGroup.message,
        success: data.disbandGroup.success,
      });
      setOpen(true);
    }
  };

  let settingsTab = null;
  settingsTab = (
    <TabPanel value={value} index={3}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Edit Information</Typography>
          <Divider />
          {editInfoSection}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Invite mates</Typography>
          <Divider />
          {inviteByUsernameSection}
        </Grid>
        <Grid item xs={12}>
          <Button
            className={classes.leaveGroup}
            onClick={() => setOpenDialog(true)}
          >
            Disband Clique
          </Button>
          <ConfirmationDialog
            handleProceed={handleDisbandGroup}
            handleClose={() => setOpenDialog(false)}
            open={openDialog}
            dialogTitle={`Disband ${name}?`}
            diaglogContent="Are you sure you wanna disband this clique?"
            dialogCancelBtnTitle="Cancel"
            dialogProceedBtnTitle="Disband"
          />
        </Grid>
      </Grid>
    </TabPanel>
  );

  return (
    <Layout variant="regular">
      <Grid container spacing={2} justify="flex-start" direction="column">
        <Grid container item xs={12}>
          <Typography variant="h2" color="primary">
            {name}
          </Typography>
          {requestToGroupSection}
        </Grid>
        <Grid item xs={12}>
          <StyledTabs
            value={value}
            onChange={handleChange}
            aria-label="clique page"
          >
            <StyledTab key={0} label="Info" {...a11yProps(0)} />
            {!meFetch && me?.me && isMember && (
              <StyledTab key={1} label="Messages" {...a11yProps(1)} />
            )}
            {!meFetch && me?.me && isMember && (
              <StyledTab key={2} label="Schedule" {...a11yProps(2)} />
            )}
            {!meFetch && me?.me && isLeader && (
              <StyledTab key={3} label="Settings" {...a11yProps(3)} />
            )}
          </StyledTabs>
        </Grid>
        {infoTab}
        {messageTab}
        {scheduleTab}
        {settingsTab}
      </Grid>
      <AlertSnackBar handleClose={handleClose} open={open} {...status} />
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient)(CliquePage);
