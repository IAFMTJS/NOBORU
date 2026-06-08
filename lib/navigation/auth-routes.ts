export const AUTH_ROUTES = {
  home: "/home",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  updatePassword: "/update-password",
  callback: "/auth/callback",
} as const;

export const PROTECTED_ROUTE_PREFIXES = [
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

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isAuthOnlyRoute(pathname: string): boolean {
  return AUTH_ONLY_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
