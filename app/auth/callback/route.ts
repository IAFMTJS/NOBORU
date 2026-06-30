import { createClient } from "@/lib/supabase/server";
import { ensureUserRecords, resolveDisplayName } from "@/lib/supabase/ensure-user-records";
import { ensureProfileJwtClaims } from "@/lib/auth/profile-jwt-claims";
import { NextResponse } from "next/server";

import { AUTH_ROUTES } from "@/lib/navigation/auth-routes";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? AUTH_ROUTES.home;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        try {
          await ensureUserRecords(supabase, {
            userId: user.id,
            displayName: resolveDisplayName(user.user_metadata),
          });
          await ensureProfileJwtClaims(user.id);
          await supabase.auth.refreshSession();
        } catch (bootstrapError) {
          console.error(
            "[auth/callback] Failed to ensure user records:",
            bootstrapError instanceof Error
              ? bootstrapError.message
              : bootstrapError,
          );

          const loginUrl = new URL(AUTH_ROUTES.login, origin);
          loginUrl.searchParams.set("error", "account_setup_failed");
          return NextResponse.redirect(loginUrl.toString());
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const loginUrl = new URL(AUTH_ROUTES.login, origin);
  loginUrl.searchParams.set("error", "auth_callback_failed");
  return NextResponse.redirect(loginUrl.toString());
}
