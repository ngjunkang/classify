import {
  Typography,
  Paper,
  Theme,
  Box,
  IconButton,
  Button,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Edit } from "@material-ui/icons";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import LoadingButton from "../../components/LoadingButton";
import StandardTextField from "../../components/StandardTextField";
import TextAreaField from "../../components/TextAreaField";
import CheckIcon from "@material-ui/icons/Check";
import {
  useEditUserMutation,
  useForgotPasswordMutation,
  useMeQuery,
  useToggleEditMutation,
  useUserQuery,
  useVerificationEmailMutation,
} from "../../generated/graphql";
import CreateUrqlClient from "../../utils/CreateUrqlClient";
import isServer from "../../utils/isServer";
import useGlobalStyles from "../../styles/GlobalStyles";
import { mapError } from "../../utils/mapError";
import { blue } from "@material-ui/core/colors";

interface ProfileProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexBox: {
      display: "flex",
    },
    flexBoxRow: {
      margin: 2,
      display: "flex",
      flexDirection: "row",
      alignItems: "left",
    },
    flexButton: {
      marginTop: 15,
      color: "grey",
    },
    flexGrowContent: {
      flexGrow: 1,
      padding: 15,
    },
    itemPadding: {
      paddingTop: 10,
      paddingLeft: 5,
    },
    emailPadding: {
      paddingTop: 10,
      paddingLeft: 5,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    text: {
      paddingLeft: 10,
      marginTop: 5,
      paddingBottom: 15,
    },
    title: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    link: {
      display: "flex",
      flexDirection: "column",
      alignItems: "right",
      marginTop: 10,
    },
    edit: {
      marginRight: 10,
      marginTop: 10,
    },
    checkIcon: {
      marginLeft: 5,
    },
    red: {
      color: "red",
    },
    blue: {
      color: blue[500],
    },
  })
);

const Profile: React.FC<ProfileProps> = ({}) => {
  const styles = useStyles();
  const globalStyles = useGlobalStyles();
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = useUserQuery({
    pause: intId === -1,
    variables: { userId: intId },
  });
  const [, forgotPassword] = useForgotPasswordMutation();
  const [isComplete, setIsComplete] = useState(false);
  const [{ data: me }] = useMeQuery({
    pause: isServer(),
  });
  const [, editUser] = useEditUserMutation();
  const [, toggleEdit] = useToggleEditMutation();
  const [, verificationEmail] = useVerificationEmailMutation();
  return (
    <Layout variant="regular">
      <Typography className={styles.title} variant="h2" color="primary">
        Profile
      </Typography>
      {(!fetching && !data) || !data?.user ? (
        <div>No such user</div>
      ) : fetching && !data ? (
        <div>Loading...</div>
      ) : (
        <Box>
          {!data.user.isVerified ? (
            <Typography className={styles.red}>
              Email is not verified!
            </Typography>
          ) : null}
          <Paper className={styles.flexBox} elevation={2}>
            {data.user.editMode ? (
              <Box className={styles.flexGrowContent}>
                <Formik
                  initialValues={{
                    displayName: data.user.displayName,
                    description: data.user.description,
                    email: data.user.email,
                    userId: data.user.id,
                  }}
                  onSubmit={async (update, { setErrors }) => {
                    const res = await editUser({ ...update });
                    if (res.data.editUser.errors) {
                      setErrors(mapError(res.data.editUser.errors));
                    } else {
                      toggleEdit({ userId: data.user.id });
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <StandardTextField
                        label="change display name"
                        name="displayName"
                      />
                      {data.user.isVerified ? null : (
                        <StandardTextField label="change email" name="email" />
                      )}
                      <TextAreaField
                        label="edit description"
                        name="description"
                      />
                      <Box className={styles.flexBoxRow}>
                        <Button
                          className={styles.flexButton}
                          onClick={() => {
                            toggleEdit({ userId: data.user.id });
                            setIsComplete(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <LoadingButton isLoading={isSubmitting} type="submit">
                          Save changes
                        </LoadingButton>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Box>
            ) : (
              <Box className={styles.flexGrowContent}>
                <Typography variant="h4" color="primary">
                  {data.user.displayName}
                </Typography>
                <Paper elevation={0}>
                  <Typography
                    className={styles.itemPadding}
                    variant="h5"
                    color="primary"
                  >
                    Username
                  </Typography>
                  <Typography className={styles.text} variant="body1">
                    {data.user.username}
                  </Typography>
                </Paper>
                {me?.me?.id === data.user.id && (
                  <Paper elevation={0}>
                    <Box className={styles.emailPadding}>
                      <Typography variant="h5" color="primary">
                        Email
                      </Typography>
                      {data.user.isVerified ? (
                        <CheckIcon className={styles.checkIcon} />
                      ) : null}
                    </Box>
                    <Typography className={styles.text} variant="body1">
                      {data.user.email}
                    </Typography>
                  </Paper>
                )}
                <Paper elevation={0}>
                  <Typography
                    className={styles.itemPadding}
                    variant="h5"
                    color="primary"
                  >
                    Description
                  </Typography>
                  <Typography className={styles.text} variant="body1">
                    {data.user.description}
                  </Typography>
                </Paper>
              </Box>
            )}
            {me?.me?.id !== data.user.id || data.user.editMode ? null : (
              <Box className={styles.edit}>
                {data.user.isVerified ? null : (
                  <Button
                    className={styles.blue}
                    onClick={async () => {
                      await verificationEmail({ userId: data.user.id });
                      alert(
                        "Email sent. Please check your email (and also Junk) for the link to verify email. Thank you!"
                      );
                    }}
                  >
                    Verify Email
                  </Button>
                )}
                <IconButton
                  onClick={() => {
                    toggleEdit({ userId: data.user.id });
                  }}
                >
                  <Edit />
                </IconButton>
              </Box>
            )}
          </Paper>
          {data.user.editMode ? (
            <Box className={styles.flexButton}>
              <Formik
                initialValues={{
                  email: data.user.email,
                }}
                onSubmit={async (data) => {
                  await forgotPassword(data);
                  setIsComplete(true);
                }}
              >
                {({ isSubmitting }) =>
                  isComplete ? (
                    <Box>
                      Email sent. Please check your email (and also Junk) for
                      the link to reset your password. Thank you!
                    </Box>
                  ) : (
                    <Form>
                      <LoadingButton isLoading={isSubmitting} type="submit">
                        Reset Password
                      </LoadingButton>
                    </Form>
                  )
                }
              </Formik>
            </Box>
          ) : null}
        </Box>
      )}
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient, { ssr: true })(Profile);
