import { Box, Button, Grid, Theme, Typography } from "@material-ui/core";
import { createStyles, fade, makeStyles } from "@material-ui/core/styles";
import { Add } from "@material-ui/icons";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import GroupListItem from "../../../components/GroupListItem";
import Layout from "../../../components/Layout";
import DataLoadingError from "../../../components/misc/DataLoadingError";
import ModuleSelection from "../../../components/ModuleSelection";
import { Module, useGroupsQuery } from "../../../generated/graphql";
import CreateUrqlClient from "../../../utils/CreateUrqlClient";

interface CliquesIndexPageProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addButton: {
      margin: theme.spacing(2, 0, 2, 2),
      marginLeft: "auto",
    },
    paddedBox: {
      padding: 2,
    },
    flexGrowBox: {
      flexGrow: 1,
    },
    center: {
      display: "flex",
      height: 300,
      padding: theme.spacing(2),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: fade(theme.palette.background.default, 0.15),
    },
  })
);

const CliquesIndexPage: React.FC<CliquesIndexPageProps> = ({}) => {
  const classes = useStyles();
  const router = useRouter();
  const [moduleId, setModuleId] = useState(0);

  const [{ data, fetching }] = useGroupsQuery({
    variables: { moduleId: moduleId },
  });

  let display;
  if (fetching) {
    display = (
      <Grid container direction="column" spacing={2}>
        {[1, 2, 3, 4, 5].map((id) => {
          return <GroupListItem pageProps key={id} isLoading />;
        })}
      </Grid>
    );
  } else if (!fetching && data) {
    if (data.groups.length) {
      display = (
        <Grid container direction="column" spacing={2}>
          {data.groups.map((group) => {
            return <GroupListItem pageProps {...group} key={group.id} />;
          })}
        </Grid>
      );
    } else {
      display = (
        <DataLoadingError
          text="No cliques yet, create the first clique!"
          className={classes.center}
        />
      );
    }
  } else {
    display = (
      <DataLoadingError
        text="Check your network connection! Or report this as bug!"
        className={classes.center}
      />
    );
  }

  return (
    <Layout variant="regular">
      <Grid container spacing={2} justify="flex-start" direction="column">
        <Grid container item xs={12}>
          <Typography variant="h2" color="primary">
            Cliques
          </Typography>
          <NextLink href={`${router.pathname}/new`}>
            <Button
              variant="contained"
              color="primary"
              className={classes.addButton}
              startIcon={<Add />}
            >
              Create Clique
            </Button>
          </NextLink>
        </Grid>

        <Box className={classes.paddedBox}>
          <ModuleSelection
            handleOnChange={(e, value) => {
              setModuleId(!value ? 0 : value.id);
            }}
          />
        </Box>

        <Grid item xs={12}>
          {display}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient, { ssr: false })(
  CliquesIndexPage
);
