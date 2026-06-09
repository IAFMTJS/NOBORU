import { getAdminSession } from "@/lib/admin/session";
import { forbidden, unauthorized } from "@/lib/api/responses";

export async function requireContentAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    const supabase = await import("@/lib/supabase/server").then((m) =>
      m.createClient(),
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { session: null, error: unauthorized() };
    }

    return {
      session: null,
      error: forbidden("Content admin access required."),
    };
  }

  return { session, error: null };
}
