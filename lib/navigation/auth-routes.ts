export const AUTH_ROUTES = {
  home: "/home",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  updatePassword: "/update-password",
  callback: "/auth/callback",
  onboarding: "/onboarding",
} as const;

export const AUTH_REQUIRED_PREFIXES = [
  "/home",
  "/learn",
  "/review",
  "/games",
  "/community",
  "/profile",
  "/settings",
  "/onboarding",
  "/admin",
] as const;

export const ADMIN_ROUTE_PREFIXES = ["/admin"] as const;

/** App routes that require completed onboarding. */
export const ONBOARDING_REQUIRED_PREFIXES = [
  "/home",
  "/learn",
  "/review",
  "/games",
  "/community",
  "/profile",
  "/settings",
] as const;

export const AUTH_ONLY_ROUTE_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
] as const;

export function matchesRoutePrefix(
  pathname: string,
  prefixes: readonly string[],
): boolean {
  return prefixes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isAuthRequiredRoute(pathname: string): boolean {
  return matchesRoutePrefix(pathname, AUTH_REQUIRED_PREFIXES);
}

export function isOnboardingRequiredRoute(pathname: string): boolean {
  return matchesRoutePrefix(pathname, ONBOARDING_REQUIRED_PREFIXES);
}

export function isAuthOnlyRoute(pathname: string): boolean {
  return matchesRoutePrefix(pathname, AUTH_ONLY_ROUTE_PREFIXES);
}

export function isOnboardingRoute(pathname: string): boolean {
  return pathname === AUTH_ROUTES.onboarding;
}

export function isAdminRoute(pathname: string): boolean {
  return matchesRoutePrefix(pathname, ADMIN_ROUTE_PREFIXES);
}

/** @deprecated Use isAuthRequiredRoute or isOnboardingRequiredRoute */
export function isProtectedRoute(pathname: string): boolean {
  return isAuthRequiredRoute(pathname);
}
