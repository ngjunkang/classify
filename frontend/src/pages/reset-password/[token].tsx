import { Box, Link, Theme, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import router from "next/router";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import LoadingButton from "../../components/LoadingButton";
import PasswordInputField from "../../components/PasswordTextField";
import { useResetPasswordMutation } from "../../generated/graphql";
import useGlobalStyles from "../../styles/GlobalStyles";
import CreateUrqlClient from "../../utils/CreateUrqlClient";
import { mapError } from "../../utils/mapError";
import { validateResetPasswordForm } from "../../utils/validations";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sameLine: {
      display: "flex",
      margin: 1,
    },
    separator: {
      marginLeft: 3,
    },
  })
);

const ResetPassword: NextPage = () => {
  const styles = useStyles();
  const globalStyles = useGlobalStyles();

  const [, resetPassword] = useResetPasswordMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <Layout variant="small">
      <Typography variant="h2" color="primary">
        Reset Password
      </Typography>
      <Formik
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
        onSubmit={async (data, { setErrors }) => {
          const res = await resetPassword({
            password: data.password,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          });

          if (res.data?.resetPassword.errors) {
            const errorRecord: Record<string, string> = mapError(
              res.data.resetPassword.errors
            );
            if ("token" in errorRecord) {
              setTokenError(errorRecord.token);
            } else {
              setTokenError("");
            }
            setErrors(errorRecord);
          } else if (res.data?.resetPassword.user) {
            router.push("/");
          }
        }}
        validate={(values) => validateResetPasswordForm(values)}
      >
        {({ isSubmitting }) => (
          <Form>
            <PasswordInputField
              labelWidth={80}
              label="Password"
              name="password"
            />
            <PasswordInputField
              labelWidth={140}
              label="Confirm Password"
              name="confirmPassword"
            />
            {tokenError && (
              <Box className={styles.sameLine}>
                <Box color="red">{tokenError}</Box>
                <Box className={styles.separator}>
                  <NextLink href="/forgot-password">
                    <Link className={globalStyles.pointerOnLink}>
                      Click here to get a new one
                    </Link>
                  </NextLink>
                </Box>
              </Box>
            )}

            <LoadingButton
              isLoading={isSubmitting}
              disabled={!!tokenError}
              type="submit"
            >
              Reset
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient, { ssr: false })(ResetPassword);
