import { Box, TextField } from "@material-ui/core";
import { FieldAttributes, useField } from "formik";
import React from "react";

interface TextAreaFieldProps {
  label: string;
}

const TextAreaField: React.FC<FieldAttributes<TextAreaFieldProps>> = ({
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
        placeholder="Begin typing here"
        rows={5}
        rowsMax={10}
        multiline
        fullWidth
        required
        variant="outlined"
        autoComplete="off"
      />
    </Box>
  );
};

export default TextAreaField;
