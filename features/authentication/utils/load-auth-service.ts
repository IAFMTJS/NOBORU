type AuthServiceModule = typeof import("@/features/authentication/services/auth.service");

let authServicePromise: Promise<AuthServiceModule["authService"]> | null = null;

/** Loads Supabase-backed auth service on demand — keeps login/register initial bundles smaller. */
export function loadAuthService(): Promise<AuthServiceModule["authService"]> {
  authServicePromise ??= import("@/features/authentication/services/auth.service").then(
    (module) => module.authService,
  );
  return authServicePromise;
}
