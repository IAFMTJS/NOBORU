export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ResetPasswordInput = {
  email: string;
};

export type UpdatePasswordInput = {
  password: string;
  confirmPassword: string;
};

export type AuthResult = {
  success: boolean;
  error?: string;
  requiresEmailConfirmation?: boolean;
  message?: string;
};
