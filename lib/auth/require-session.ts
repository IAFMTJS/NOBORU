import { createClient } from "@/lib/supabase/server";
import { unauthorized } from "@/lib/api/responses";

export type AuthSession = {
  userId: string;
  email: string;
};

export async function getAuthSession(): Promise<AuthSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email ?? "",
  };
}

export async function requireAuthSession() {
  const session = await getAuthSession();

  if (!session) {
    return { session: null, error: unauthorized() };
  }

  return { session, error: null };
}
