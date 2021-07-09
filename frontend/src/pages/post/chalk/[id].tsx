import { Box, Button, Theme, Typography } from "@material-ui/core";
import { Formik, Form } from "formik";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/Layout";
import LoadingButton from "../../../components/LoadingButton";
import StandardTextField from "../../../components/StandardTextField";
import TextAreaField from "../../../components/TextAreaField";
import { useUpdatePostMutation } from "../../../generated/graphql";
import CreateUrqlClient from "../../../utils/CreateUrqlClient";
import { postFromUrl } from "../../../utils/postFromUrl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);

const EditPost = ({}) => {
  const router = useRouter();

  const styles = useStyles();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = postFromUrl();
  const [, updatePost] = useUpdatePostMutation();
  if (fetching) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }
  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }
  return (
    <Layout variant="small">
      <Typography variant="h2" color="primary">
        Update Post
      </Typography>
      <Formik
        initialValues={{
          title: data.post.title,
          content: data.post.content,
        }}
        onSubmit={async (update) => {
          await updatePost({ id: intId, ...update });
          router.push("/whiteboard");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <StandardTextField label="Title" name="title" />
            <TextAreaField label="Text" name="content" />
            <Box className={styles.flexBoxRow}>
              <Button
                className={styles.flexButton}
                onClick={() => {
                  if (sessionStorage.getItem("prevPath")) {
                    const prev = sessionStorage.getItem("prevPath");
                    router.push(prev);
                  } else {
                    router.push("/whiteboard");
                  }
                }}
              >
                Cancel
              </Button>
              <LoadingButton isLoading={isSubmitting} type="submit">
                Update Post
              </LoadingButton>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient)(EditPost);
