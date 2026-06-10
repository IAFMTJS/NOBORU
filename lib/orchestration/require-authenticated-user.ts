import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { getCachedAuthenticatedContext } from "@/lib/cache/request-cache";

export async function requireAuthenticatedUserId(): Promise<string> {
  const context = await getCachedAuthenticatedContext();

  if (!context) {
    redirect(AUTH_ROUTES.login);
  }

  if (!context.onboardingCompleted) {
    redirect(AUTH_ROUTES.onboarding);
  }

  return context.userId;
}
