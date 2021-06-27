import React from "react";
import {
  FormControlLabel,
  Checkbox,
  CheckboxProps,
  Box,
} from "@material-ui/core";

import { FieldAttributes, useField } from "formik";

interface CheckBoxFieldProps {
  label: string;
}
const CheckBoxField: React.FC<
  FieldAttributes<CheckBoxFieldProps & CheckboxProps>
> = ({ label, ...props }) => {
  const [field] = useField<{}>(props);
  return (
    <Box>
      <FormControlLabel
        {...field}
        control={<Checkbox {...props} {...field} />}
        label={label}
      />
    </Box>
  );
};

export default CheckBoxField;
