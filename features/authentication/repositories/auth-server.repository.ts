import { createClient } from "@/lib/supabase/server";

/**
 * Server-side auth data access.
 * Used by services in server components and route handlers.
 */
class AuthServerRepository {
  async getUser() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    return data.user;
  }
}

export const authServerRepository = new AuthServerRepository();
