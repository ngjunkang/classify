import { Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import CheckBoxField from "../../../components/CheckBoxField";
import Layout from "../../../components/Layout";
import LoadingButton from "../../../components/LoadingButton";
import ModuleSelection from "../../../components/ModuleSelection";
import StandardTextField from "../../../components/StandardTextField";
import TextAreaField from "../../../components/TextAreaField";
import { useCreateGroupMutation } from "../../../generated/graphql";
import checkIsNotAuth from "../../../utils/checkIsNotAuth";
import CreateUrqlClient from "../../../utils/CreateUrqlClient";
import { mapError } from "../../../utils/mapError";

interface CreateNewCliqueProps {}

const CreateNewClique: React.FC<CreateNewCliqueProps> = ({}) => {
  checkIsNotAuth();
  const [, createGroup] = useCreateGroupMutation();
  const router = useRouter();

  return (
    <Layout variant="regular">
      <Typography variant="h2" color="primary">
        Create New Clique
      </Typography>
      <Formik
        initialValues={{
          name: "",
          description: "",
          requirements: "",
          is_private: false,
          module_id: 0,
        }}
        onSubmit={async (data, { setErrors }) => {
          console.log(data);
          const res = await createGroup({ details: data });

          if (res.data?.createGroup.errors) {
            setErrors(mapError(res.data.createGroup.errors));
          } else if (res.data?.createGroup.group) {
            const group = res.data.createGroup.group;
            if (group.is_private) {
              router.push(`/class/cliques/${group.slug}`);
            } else {
              router.push("/class/cliques");
            }
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <StandardTextField label="Clique Name" name="name" />
            <TextAreaField
              label="Clique Description"
              name="description"
              optional
            />
            <TextAreaField
              label="Clique Requirements"
              name="requirements"
              optional
            />
            <ModuleSelection
              handleOnChange={(e, value) =>
                setFieldValue("module_id", !value ? 0 : value.id)
              }
            />
            <CheckBoxField
              name="is_private"
              label="Private Group (not listed)"
            />

            <LoadingButton isLoading={isSubmitting} type="submit">
              Create Group
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient)(CreateNewClique);
