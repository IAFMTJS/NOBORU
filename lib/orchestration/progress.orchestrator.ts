import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { progressDashboardService } from "@/features/progress/services/progress-dashboard.service";
import type { ProgressDashboardViewModel } from "@/features/progress/types/progress-dashboard.types";
import { profileServerService } from "@/features/profile/services/profile-server.service";

export async function getProgressDashboard(): Promise<ProgressDashboardViewModel> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  if (!profile.onboardingCompleted) {
    redirect(AUTH_ROUTES.onboarding);
  }

  return progressDashboardService.getDashboard(profile.userId);
}
