export const AUTH_ROUTES = {
  home: "/camp",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  updatePassword: "/update-password",
  callback: "/auth/callback",
  onboarding: "/onboarding",
} as const;

export {
  AUTH_REQUIRED_PREFIXES,
  AUTH_ONLY_ROUTE_PREFIXES,
  ONBOARDING_REQUIRED_PREFIXES,
  isAuthOnlyRoute,
  isAuthRequiredRoute,
  isOnboardingRequiredRoute,
  isOnboardingRoute,
  isProtectedRoute,
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
