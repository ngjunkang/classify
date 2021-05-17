import { Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import LoadingButton from "../components/LoadingButton";
import PasswordInputField from "../components/PasswordTextField";
import StandardTextField from "../components/StandardTextField";
import Wrapper from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { mapError } from "../utils/mapError";
import { validateLoginForm } from "../utils/validations";

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
  const [, login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small">
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

            <LoadingButton isLoading={isSubmitting} type="submit">
              Login
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default login;
