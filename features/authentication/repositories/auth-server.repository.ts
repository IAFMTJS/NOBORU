import { headers } from "next/headers";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

/**
 * Server-side auth data access.
 * Used by services in server components and route handlers.
 */
class AuthServerRepository {
  async getUser(): Promise<User | null> {
    const headerStore = await headers();
    const forwardedUserId = headerStore.get("x-noboru-user-id");

    if (forwardedUserId) {
      return {
        id: forwardedUserId,
        email: headerStore.get("x-noboru-user-email") ?? "",
        user_metadata: {},
        app_metadata: {
          onboarding_completed:
            headerStore.get("x-noboru-onboarding") === "1" ? true : false,
          role: headerStore.get("x-noboru-role") ?? "learner",
        },
      } as unknown as User;
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    return data.user;
  }
}

export const authServerRepository = new AuthServerRepository();
