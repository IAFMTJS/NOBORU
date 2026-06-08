import { createClient } from "@/lib/supabase/client";

import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";

/**
 * Auth data access layer.
 * Only repositories may call Supabase directly.
 */
class AuthRepository {
  private get client() {
    return createClient();
  }

  signInWithPassword(email: string, password: string) {
    return this.client.auth.signInWithPassword({ email, password });
  }

  signUp(email: string, password: string, displayName: string) {
    return this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });
  }

  signOut() {
    return this.client.auth.signOut();
  }

  resetPasswordForEmail(email: string) {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}${AUTH_ROUTES.callback}?next=${AUTH_ROUTES.updatePassword}`
        : undefined;

    return this.client.auth.resetPasswordForEmail(email, { redirectTo });
  }

  updatePassword(password: string) {
    return this.client.auth.updateUser({ password });
  }
}

export const authRepository = new AuthRepository();
