import { Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";
import LoadingButton from "../components/LoadingButton";
import StandardTextField from "../components/StandardTextField";
import TextAreaField from "../components/TextAreaField";
import { useCreatePostMutation } from "../generated/graphql";
import checkIsNotAuth from "../utils/checkIsNotAuth";
import CreateUrqlClient from "../utils/CreateUrqlClient";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  checkIsNotAuth();
  const [, CreatePost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Typography variant="h2" color="primary">
        Create Post
      </Typography>
      <Formik
        initialValues={{
          title: "",
          content: "",
        }}
        onSubmit={async (data) => {
          const { error } = await CreatePost({ details: data });
          if (!error) {
            router.push("/forum");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <StandardTextField label="Title" name="title" />
            <TextAreaField label="Text" name="content" />
            <LoadingButton isLoading={isSubmitting} type="submit">
              Create Post
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient)(CreatePost);
