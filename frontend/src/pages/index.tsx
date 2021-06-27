import { Box, Button, Theme, Typography } from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";
import { useMeQuery } from "../generated/graphql";
import CreateUrqlClient from "../utils/CreateUrqlClient";
import isServer from "../utils/isServer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexBoxCol: {
      margin: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 15,
    },
    flexBoxRow: {
      margin: 2,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    buttonLeft: {
      color: "white",
      backgroundColor: lightBlue[500],
      marginTop: 10,
    },
    buttonRight: {
      color: "white",
      backgroundColor: lightBlue[500],
      marginRight: "auto",
      marginTop: 10,
      marginLeft: 8,
    },
  })
);

const Index = () => {
  const router = useRouter();
  const styles = useStyles();
  const [{ data: me }] = useMeQuery({
    pause: isServer(),
  });

  return (
    <Layout variant="regular">
      {me?.me ? (
        <Typography>{`Hello${
          me?.me ? ", " + me.me.username : ""
        }!`}</Typography>
      ) : null}
      <br />
      <Box className={styles.flexBoxCol}>
        <Typography variant="h2" color="primary">
          Welcome to Classify!
        </Typography>
        {me?.me ? (
          <Box className={styles.flexBoxRow}>
            <Button
              className={styles.buttonLeft}
              onClick={() => router.push("/whiteboard")}
            >
              To Whiteboard
            </Button>
            <Button
              className={styles.buttonRight}
              onClick={() => router.push("/class/cliques")}
            >
              To Cliques
            </Button>
          </Box>
        ) : (
          <Box className={styles.flexBoxRow}>
            <Button
              className={styles.buttonLeft}
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              className={styles.buttonRight}
              onClick={() => router.push("/register")}
            >
              register
            </Button>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient, { ssr: false })(Index);
