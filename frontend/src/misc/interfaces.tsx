export interface RegisterFieldsProps {
  username: string;
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFieldsProps {
  emailOrUsername: string;
  password: string;
}
