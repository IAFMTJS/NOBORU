import { createClientUncached } from "@/lib/supabase/create-client-uncached";

export type AuthSession = {
  userId: string;
  email: string;
};

export async function getAuthSessionUncached(): Promise<AuthSession | null> {
  const supabase = await createClientUncached();
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
