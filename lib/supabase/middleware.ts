import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import {
  AUTH_ROUTES,
  isAuthOnlyRoute,
  isAuthRequiredRoute,
  isOnboardingRequiredRoute,
  isOnboardingRoute,
} from "@/lib/navigation/auth-routes";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "[middleware] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && isAuthRequiredRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = AUTH_ROUTES.login;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAuthOnlyRoute(pathname)) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = AUTH_ROUTES.home;
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  if (user && (isOnboardingRequiredRoute(pathname) || isOnboardingRoute(pathname))) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("[middleware] Failed to load profile:", profileError.message);
      return supabaseResponse;
    }

    const onboardingCompleted = profile?.onboarding_completed ?? false;

    if (!onboardingCompleted && isOnboardingRequiredRoute(pathname)) {
      const onboardingUrl = request.nextUrl.clone();
      onboardingUrl.pathname = AUTH_ROUTES.onboarding;
      onboardingUrl.search = "";
      return NextResponse.redirect(onboardingUrl);
    }

    if (onboardingCompleted && isOnboardingRoute(pathname)) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = AUTH_ROUTES.home;
      homeUrl.search = "";
      return NextResponse.redirect(homeUrl);
    }
  }

  return supabaseResponse;
}
