import { Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";
import LoadingButton from "../components/LoadingButton";
import PasswordInputField from "../components/PasswordTextField";
import StandardTextField from "../components/StandardTextField";
import { useRegisterMutation } from "../generated/graphql";
import CreateUrqlClient from "../utils/CreateUrqlClient";
import { mapError } from "../utils/mapError";
import { validateRegisterForm } from "../utils/validations";

interface registerProps {}

// username, email, display name, two password
const register: React.FC<registerProps> = ({}) => {
  const [, register] = useRegisterMutation();
  const router = useRouter();

  return (
    <Layout variant="small">
      <Typography variant="h2" color="primary">
        Register
      </Typography>
      <Formik
        initialValues={{
          username: "",
          email: "",
          displayName: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={async (data, { setErrors }) => {
          const res = await register({
            username: data.username,
            password: data.password,
            displayName: data.displayName,
            email: data.email,
          });

          if (res.data?.register.errors) {
            setErrors(mapError(res.data.register.errors));
          } else if (res.data?.register.user) {
            router.push("/");
          }
        }}
        validate={(values) => validateRegisterForm(values)}
      >
        {({ isSubmitting }) => (
          <Form>
            <StandardTextField label="Username" name="username" />
            <StandardTextField label="Email" name="email" />
            <StandardTextField label="Display Name" name="displayName" />
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

            <LoadingButton isLoading={isSubmitting} type="submit">
              Register
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient)(register);
