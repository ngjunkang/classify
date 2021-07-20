import { Box, Button, Theme, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";
import LoadingButton from "../components/LoadingButton";
import ModuleSelection from "../components/ModuleSelection";
import StandardTextField from "../components/StandardTextField";
import TextAreaField from "../components/TextAreaField";
import { useCreatePostMutation } from "../generated/graphql";
import checkIsNotAuth from "../utils/checkIsNotAuth";
import CreateUrqlClient from "../utils/CreateUrqlClient";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexBoxCol: {
      margin: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
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
    title: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  })
);

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const styles = useStyles();
  checkIsNotAuth();
  const [, CreatePost] = useCreatePostMutation();
  return (
    <Layout variant="regular">
      <Typography className={styles.title} variant="h2" color="primary">
        Create Post
      </Typography>
      <Formik
        initialValues={{
          title: "",
          content: "",
          module_id: 0,
        }}
        onSubmit={async (data) => {
          const { error } = await CreatePost({ details: data });
          if (!error) {
            router.push("/whiteboard");
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <StandardTextField label="Title" name="title" />
            <TextAreaField label="Text" name="content" />
            <ModuleSelection
              handleOnChange={(e, value) =>
                setFieldValue("module_id", !value ? 0 : value.id)
              }
            />
            <Box className={styles.flexBoxCol}>
              <Box className={styles.flexBoxRow}>
                <Button
                  className={styles.flexButton}
                  onClick={() => router.push("/whiteboard")}
                >
                  Cancel
                </Button>
                <LoadingButton isLoading={isSubmitting} type="submit">
                  Create Post
                </LoadingButton>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient)(CreatePost);
