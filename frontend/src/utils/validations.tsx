import { RegisterFieldsProps, LoginFieldsProps } from "../misc/interfaces";

export function validateRegisterForm(values: RegisterFieldsProps) {
  const errors: Record<string, string> = {};

  // client side validation
  // copy to server side as well (for server side validation) after editing
  // only the if conditions to password
  if (!values.username.trim()) {
    errors.username = "Username required";
  } else if (!/^[A-Za-z][A-Za-z0-9]+$/.test(values.username.trim())) {
    errors.username = "Only alphanumeric characters are allowed";
  } else if (
    !(values.username.trim().length > 5 && values.username.trim().length < 21)
  ) {
    errors.username = "Username length requirement: 6 to 20 characters";
  }

  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!values.email) {
    errors.email = "Email required";
  } else if (!regex.test(values.email)) {
    errors.email = "Email address is invalid";
  } else if (values.email.trim().length > 320) {
    errors.emailOrUsername = "Email address is invalid";
  }

  if (!values.displayName) {
    errors.displayName = "Display name is required";
  } else if (!/^[A-Za-z0-9\s]+$/.test(values.displayName)) {
    errors.username = "Only alphanumeric characters are allowed";
  } else if (
    !(values.displayName.length > 3 && values.displayName.length < 21)
  ) {
    errors.displayName = "Display name length requirement: 4 to 20 characters";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (!(values.password.length > 7 && values.password.length < 21)) {
    errors.password = "Password length requirement: 8 to 20 characters";
  }

  // until here

  if (!values.confirmPassword) {
    errors.confirmPassword = "Password is required";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function validateLoginForm(values: LoginFieldsProps) {
  const errors: Record<string, string> = {};

  // client side validation
  // copy to server side as well (for server side validation) after editing
  // prevent brute force attack

  if (!values.emailOrUsername.trim()) {
    errors.emailOrUsername = "Email or Username required";
  } else {
    if (values.emailOrUsername.trim().includes("@")) {
      // email
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!regex.test(values.emailOrUsername.trim())) {
        errors.emailOrUsername = "Email address is invalid";
      } else if (values.emailOrUsername.trim().length > 320) {
        errors.emailOrUsername = "Email address is invalid";
      }
    } else {
      // username
      if (!/^[A-Za-z0-9]+$/.test(values.emailOrUsername.trim())) {
        errors.emailOrUsername = "Only alphanumeric characters are allowed";
      } else if (
        !(
          values.emailOrUsername.trim().length > 5 &&
          values.emailOrUsername.trim().length < 21
        )
      ) {
        errors.emailOrUsername = "Invalid input, please check again";
      }
    }
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (!(values.password.length > 7 && values.password.length < 21)) {
    errors.password = "Invalid password, please check again";
  }

  return errors;
}

interface ResetPasswordFieldsProps {
  password: string;
  confirmPassword: string;
}

export function validateResetPasswordForm(values: ResetPasswordFieldsProps) {
  const errors: Record<string, string> = {};

  if (!values.password) {
    errors.password = "Password is required";
  } else if (!(values.password.length > 7 && values.password.length < 21)) {
    errors.password = "Password length requirement: 8 to 20 characters";
  }

  // until here

  if (!values.confirmPassword) {
    errors.confirmPassword = "Password is required";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

interface ForgotPasswordFieldsProps {
  email: string;
}

export function validateForgotPasswordForm(values: ForgotPasswordFieldsProps) {
  const errors: Record<string, string> = {};

  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!values.email) {
    errors.email = "Email required";
  } else if (!regex.test(values.email)) {
    errors.email = "Email address is invalid";
  } else if (values.email.trim().length > 320) {
    errors.emailOrUsername = "Email address is invalid";
  }

  return errors;
}
