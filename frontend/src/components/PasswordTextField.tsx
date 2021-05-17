import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Theme,
  FormHelperText,
  Box,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import React, { useState } from "react";
import clsx from "clsx";
import { FieldAttributes, useField } from "formik";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    margin: {
      margin: theme.spacing(0),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: "100%",
    },
  })
);

interface PasswordInputProps {
  label: string;
  labelWidth: number;
}

const PasswordInputField: React.FC<FieldAttributes<PasswordInputProps>> = ({
  labelWidth,
  label,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  const classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box mt={1}>
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        error={!!errorText}
      >
        <InputLabel htmlFor="outlined-adornment-password">
          {label + " *"}
        </InputLabel>
        <OutlinedInput
          id={field.name}
          type={showPassword ? "text" : "password"}
          {...field}
          required
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={labelWidth}
        />
        {errorText && <FormHelperText>{errorText}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default PasswordInputField;
