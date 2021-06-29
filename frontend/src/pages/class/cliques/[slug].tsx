import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Theme,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Add } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import React, { useState } from "react";
import CheckBoxField from "../../../components/CheckBoxField";
import Layout from "../../../components/Layout";
import LoadingButton from "../../../components/LoadingButton";
import AlertSnackBar from "../../../components/misc/AlertSnackBar";
import ModuleSelection from "../../../components/ModuleSelection";
import StandardTextField from "../../../components/StandardTextField";
import StyledTab from "../../../components/tab/StyledTab";
import StyledTabs from "../../../components/tab/StyledTabs";
import TabPanel from "../../../components/tab/TabPanel";
import TextAreaField from "../../../components/TextAreaField";
import {
  useEditGroupMutation,
  useGroupQuery,
  useInviteByUserNameMutation,
  useMeQuery,
  useReplyInviteMutation,
  useReplyRequestMutation,
  useRequestToGroupMutation,
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
  const [status, setStatus] = useState({ success: false, message: "" });
  const [open, setOpen] = useState(false);

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
    return <ErrorPage statusCode={404} />;
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
  if (!meFetch && me.me && isMember) {
    membersSection = (
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
  if (!isMember || (!meFetch && !me.me)) {
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
        {membersSection}
      </Grid>
    </TabPanel>
  );

  // messages
  let messageTab = null;
  messageTab = (
    <TabPanel value={value} index={1}>
      <Typography>Coming Soon</Typography>
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
        <Grid>
          <StyledTabs
            value={value}
            onChange={handleChange}
            aria-label="clique page"
          >
            <StyledTab key={0} label="Info" {...a11yProps(0)} />
            {!meFetch && me.me && isMember && (
              <StyledTab key={1} label="Messages" {...a11yProps(1)} />
            )}
            {!meFetch && me.me && isMember && (
              <StyledTab key={2} label="Schedule" {...a11yProps(2)} />
            )}
            {!meFetch && me.me && isLeader && (
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
