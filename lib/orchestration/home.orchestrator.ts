import { redirect } from "next/navigation";

import { dashboardServerService } from "@/features/learning/services/dashboard-server.service";
import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";
import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { profileServerService } from "@/features/profile/services/profile-server.service";

/**
 * Application-layer orchestration for the home screen.
 * Composes feature services without coupling feature modules to each other.
 */
export async function getHomeDashboard(): Promise<HomeDashboardViewModel> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  if (!profile.onboardingCompleted) {
    redirect(AUTH_ROUTES.onboarding);
  }

  return dashboardServerService.getHomeDashboard(profile);
}
