import { Box, Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";
import LoadingButton from "../components/LoadingButton";
import NextLink from "../components/NextLink";
import PasswordInputField from "../components/PasswordTextField";
import StandardTextField from "../components/StandardTextField";
import { useLoginMutation } from "../generated/graphql";
import CreateUrqlClient from "../utils/CreateUrqlClient";
import { mapError } from "../utils/mapError";
import { validateLoginForm } from "../utils/validations";

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
  const [, login] = useLoginMutation();
  const router = useRouter();

  return (
    <Layout variant="small">
      <Typography variant="h2" color="primary">
        Login
      </Typography>
      <Formik
        initialValues={{
          emailOrUsername: "",
          password: "",
        }}
        onSubmit={async (data, { setErrors }) => {
          const res = await login(data);

          if (res.data?.login.errors) {
            setErrors(mapError(res.data.login.errors));
          } else if (res.data?.login.user) {
            router.push("/");
          }
        }}
        validate={(values) => validateLoginForm(values)}
      >
        {({ isSubmitting }) => (
          <Form>
            <StandardTextField
              label="Email or Username"
              name="emailOrUsername"
            />
            <PasswordInputField
              labelWidth={80}
              label="Password"
              name="password"
            />
            <Box mt={1} style={{ display: "flex" }}>
              <Box style={{ flexGrow: 1 }}>
                <NextLink href="/register">Or sign up here</NextLink>
              </Box>
              <Box>
                <NextLink href="/forgot-password">Forgot password?</NextLink>
              </Box>
            </Box>

            <LoadingButton isLoading={isSubmitting} type="submit">
              Login
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient)(login);
