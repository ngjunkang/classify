import { NextPage } from "next";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Button, Box, Theme, Typography } from "@material-ui/core";
import CreateUrqlClient from "../../utils/CreateUrqlClient";
import router from "next/router";
import { withUrqlClient } from "next-urql";
import Layout from "../../components/Layout";
import { useVerifyEmailMutation } from "../../generated/graphql";
import { useState } from "react";
import { mapError } from "../../utils/mapError";
import { lightBlue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    sameLine: {
      display: "flex",
      margin: 1,
    },
    separator: {
      marginLeft: 3,
    },
    flexButton: {
      marginTop: 15,
      color: "white",
      backgroundColor: lightBlue[500],
    },
  })
);

const VerifyEmail: NextPage = () => {
  const styles = useStyles();
  const [, verifyEmail] = useVerifyEmailMutation();
  const [tokenError, setTokenError] = useState("");
  const [isLoading, setLoading] = useState(false);
  return (
    <Layout>
      <Typography className={styles.title} variant="h2" color="primary">
        Verify Email
      </Typography>
      <Box className={styles.title}>
        {tokenError && (
          <Box className={styles.sameLine}>
            <Box color="red">{tokenError}</Box>
            <Box className={styles.separator}>
              <text>
                unable to verify email, please check status from profile page
              </text>
            </Box>
          </Box>
        )}
        <Button
          disabled={!!tokenError || isLoading}
          className={styles.flexButton}
          onClick={async () => {
            setLoading(true);
            const res = await verifyEmail({
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            });
            setLoading(false);
            if (res.data.verifyEmail.errors) {
              const errorRecord: Record<string, string> = mapError(
                res.data.verifyEmail.errors
              );
              if ("token" in errorRecord) {
                setTokenError(errorRecord.token);
              } else {
                setTokenError("");
              }
            } else if (res.data?.verifyEmail.user) {
              router.push(`/profile/${res.data?.verifyEmail.user.id}`);
            }
          }}
        >
          Verify Email
        </Button>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient, { ssr: false })(VerifyEmail);
