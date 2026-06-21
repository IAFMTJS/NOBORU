import { redirect } from "next/navigation";
import { Suspense } from "react";

import { CampBelowFold } from "@/features/camp/components/camp-below-fold";
import { CampScreen } from "@/features/camp/components/camp-screen";
import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { dashboardServerService } from "@/features/learning/services/dashboard-server.service";
import { profileServerService } from "@/features/profile/services/profile-server.service";

export const dynamic = "force-dynamic";

export default async function CampPage() {
  const profile = await profileServerService.getProfileCore();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  if (!profile.onboardingCompleted) {
    redirect(AUTH_ROUTES.onboarding);
  }

  const aboveFold = await dashboardServerService.getCampAboveFold(profile);
  const belowFoldDefaults = dashboardServerService.campBelowFoldDefaults();

  return (
    <CampScreen
      data={{
        ...aboveFold,
        shrineProtection: belowFoldDefaults.shrineProtection,
        quests: {
          daily: aboveFold.quests.daily,
          weekly: belowFoldDefaults.quests.weekly,
        },
      }}
      belowFold={
        <Suspense fallback={null}>
          <CampBelowFold userId={profile.userId} />
        </Suspense>
      }
    />
  );
}
