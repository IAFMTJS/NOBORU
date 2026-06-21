import { headers } from "next/headers";

import { createClientUncached } from "@/lib/supabase/create-client-uncached";
import { ensureProfileJwtClaims } from "@/lib/auth/profile-jwt-claims";

export type AuthSession = {
  userId: string;
  email: string;
};

export async function getAuthSessionUncached(): Promise<AuthSession | null> {
  const headerStore = await headers();
  const forwardedUserId = headerStore.get("x-noboru-user-id");

  if (forwardedUserId) {
    void ensureProfileJwtClaims(forwardedUserId);
    return {
      userId: forwardedUserId,
      email: headerStore.get("x-noboru-user-email") ?? "",
    };
  }

  const supabase = await createClientUncached();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  void ensureProfileJwtClaims(user.id);

  return {
    userId: user.id,
    email: user.email ?? "",
  };
}
