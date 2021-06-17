import { Box, Link, Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";
import LoadingButton from "../components/LoadingButton";
import PasswordInputField from "../components/PasswordTextField";
import StandardTextField from "../components/StandardTextField";
import { useLoginMutation } from "../generated/graphql";
import useGlobalStyles from "../styles/GlobalStyles";
import checkIsAuth from "../utils/checkIsAuth";
import CreateUrqlClient from "../utils/CreateUrqlClient";
import { mapError } from "../utils/mapError";
import { validateLoginForm } from "../utils/validations";

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
  const globalStyles = useGlobalStyles();

  const [, login] = useLoginMutation();
  const router = useRouter();
  checkIsAuth();
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
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
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
                <NextLink href="/register">
                  <Link className={globalStyles.pointerOnLink}>
                    Or sign up here
                  </Link>
                </NextLink>
              </Box>
              <Box>
                <NextLink href="/forgot-password">
                  <Link className={globalStyles.pointerOnLink}>
                    Forgot password?
                  </Link>
                </NextLink>
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
