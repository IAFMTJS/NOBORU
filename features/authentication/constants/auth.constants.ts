export {
  AUTH_ONLY_ROUTE_PREFIXES,
  AUTH_ROUTES,
  isAuthOnlyRoute,
  isProtectedRoute,
  PROTECTED_ROUTE_PREFIXES,
} from "@/lib/navigation/auth-routes";

export const AUTH_MESSAGES = {
  signInLoading: "Signing in...",
  signIn: "Sign In",
  signUpLoading: "Creating account...",
  signUp: "Create Account",
  signOutLoading: "Signing out...",
  signOut: "Sign Out",
  resetLinkLoading: "Sending link...",
  resetLink: "Send Reset Link",
  resetLinkSent: "Check your email for a reset link.",
  updatePasswordLoading: "Updating password...",
  updatePassword: "Update Password",
  passwordUpdated: "Password updated. You can continue climbing.",
  emailConfirmation:
    "Check your email to confirm your account before signing in.",
  passwordMismatch: "Passwords do not match.",
  passwordTooShort: "Password must be at least 8 characters.",
} as const;

export const AUTH_VALIDATION = {
  minPasswordLength: 8,
} as const;
