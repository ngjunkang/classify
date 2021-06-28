import { Box, TextField } from "@material-ui/core";
import { FieldAttributes, useField } from "formik";
import React from "react";

interface standardTextFieldProps {
  label: string;
  wantAutocomplete?: boolean;
}

const StandardTextField: React.FC<FieldAttributes<standardTextFieldProps>> = ({
  label,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";
  return (
    <Box mt={1}>
      <TextField
        label={label}
        {...field}
        helperText={errorText}
        error={!!errorText}
        fullWidth
        required
        variant="outlined"
        autoComplete={props.wantAutocomplete ? "on" : "off"}
      />
    </Box>
  );
};

export default StandardTextField;
