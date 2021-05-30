import { RegisterFieldsProps, LoginFieldsProps } from "../misc/interfaces";

export function validateRegisterForm({
  username,
  email,
  displayName,
  password,
  confirmPassword,
}: RegisterFieldsProps) {
  const errors: Record<string, string> = {};

  // client side validation
  // copy to server side as well (for server side validation) after editing
  // only the if conditions to password
  if (!username.trim()) {
    errors.username = "Username required";
  } else if (!/^[a-z0-9]+$/.test(username.trim())) {
    errors.username = "Only lowercase alphanumeric characters are allowed";
  } else if (!(username.trim().length > 5 && username.trim().length < 21)) {
    errors.username = "Username length requirement: 6 to 20 characters";
  }

  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email) {
    errors.email = "Email required";
  } else if (email.trim().length > 320) {
    errors.emailOrUsername = "Email address is invalid";
  } else if (!regex.test(email)) {
    errors.email = "Email address is invalid";
  }

  if (!displayName) {
    errors.displayName = "Display name is required";
  } else if (!/^[A-Za-z0-9\s]+$/.test(displayName)) {
    errors.username = "Only alphanumeric characters and space are allowed";
  } else if (!(displayName.length > 3 && displayName.length < 21)) {
    errors.displayName = "Display name length requirement: 4 to 20 characters";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (!(password.length > 7 && password.length < 21)) {
    errors.password = "Password length requirement: 8 to 20 characters";
  }

  // until here

  if (!confirmPassword) {
    errors.confirmPassword = "Password is required";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function validateLoginForm({
  emailOrUsername,
  password,
}: LoginFieldsProps) {
  const errors: Record<string, string> = {};

  // client side validation
  // copy to server side as well (for server side validation) after editing
  // prevent brute force attack

  if (!emailOrUsername.trim()) {
    errors.emailOrUsername = "Email or Username required";
  } else {
    if (emailOrUsername.trim().includes("@")) {
      // email
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (emailOrUsername.trim().length > 320) {
        errors.emailOrUsername = "Email address is invalid";
      } else if (!regex.test(emailOrUsername.trim())) {
        errors.emailOrUsername = "Email address is invalid";
      }
    } else {
      // username
      if (!/^[a-z0-9]+$/.test(emailOrUsername.trim())) {
        errors.emailOrUsername =
          "Only lowercase alphanumeric characters are allowed";
      } else if (
        !(
          emailOrUsername.trim().length > 5 &&
          emailOrUsername.trim().length < 21
        )
      ) {
        errors.emailOrUsername = "Invalid input, please check again";
      }
    }
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (!(password.length > 7 && password.length < 21)) {
    errors.password = "Invalid password, please check again";
  }

  return errors;
}

interface ResetPasswordFieldsProps {
  password: string;
  confirmPassword: string;
}

export function validateResetPasswordForm({
  password,
  confirmPassword,
}: ResetPasswordFieldsProps) {
  const errors: Record<string, string> = {};

  if (!password) {
    errors.password = "Password is required";
  } else if (!(password.length > 7 && password.length < 21)) {
    errors.password = "Password length requirement: 8 to 20 characters";
  }

  // until here

  if (!confirmPassword) {
    errors.confirmPassword = "Password is required";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

interface ForgotPasswordFieldsProps {
  email: string;
}

export function validateForgotPasswordForm({
  email,
}: ForgotPasswordFieldsProps) {
  const errors: Record<string, string> = {};

  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email) {
    errors.email = "Email required";
  } else if (email.trim().length > 320) {
    errors.emailOrUsername = "Email address is invalid";
  } else if (!regex.test(email)) {
    errors.email = "Email address is invalid";
  }

  return errors;
}
