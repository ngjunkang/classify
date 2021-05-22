import { Box, Typography } from "@material-ui/core";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router from "next/router";
import React, { useState } from "react";
import Layout from "../components/Layout";
import LoadingButton from "../components/LoadingButton";
import PasswordInputField from "../components/PasswordTextField";
import StandardTextField from "../components/StandardTextField";
import { useForgotPasswordMutation } from "../generated/graphql";
import CreateUrqlClient from "../utils/CreateUrqlClient";
import { mapError } from "../utils/mapError";
import { validateLoginForm } from "../utils/validations";
import login from "./login";

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [isComplete, setIsComplete] = useState(false);

  return (
    <Layout variant="small">
      <Typography variant="h2" color="primary">
        Forgot Password
      </Typography>
      <Formik
        initialValues={{
          email: "",
        }}
        onSubmit={async (data) => {
          await forgotPassword(data);
          setIsComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          isComplete ? (
            <Box>
              Email sent. Please check your email (and also Junk) for the link
              to reset your password. Thank you!
            </Box>
          ) : (
            <Form>
              <StandardTextField label="Email" name="email" />

              <LoadingButton isLoading={isSubmitting} type="submit">
                Request Password
              </LoadingButton>
            </Form>
          )
        }
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient)(ForgotPassword);
