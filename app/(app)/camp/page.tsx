import { redirect } from "next/navigation";
import { Suspense } from "react";

import { CampBelowFold } from "@/features/camp/components/camp-below-fold";
import { CampScreen } from "@/features/camp/components/camp-screen";
import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { dashboardServerService } from "@/features/learning/services/dashboard-server.service";
import { profileServerService } from "@/features/profile/services/profile-server.service";
import { shrineProtectionService } from "@/features/streak-protection/services/shrine-protection.service";
import { getCachedQuestDashboard } from "@/lib/cache/dashboard-cache";

export const dynamic = "force-dynamic";

export default async function CampPage() {
  const profile = await profileServerService.getProfileCore();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  if (!profile.onboardingCompleted) {
    redirect(AUTH_ROUTES.onboarding);
  }

  const [aboveFold, quests, shrineProtection] = await Promise.all([
    dashboardServerService.getCampAboveFold(profile),
    getCachedQuestDashboard(profile.userId),
    shrineProtectionService.getSummary(profile.userId),
  ]);

  const belowFold = {
    shrineProtection,
    quests: {
      weekly: quests.weekly,
    },
  };

  return (
    <CampScreen
      data={{
        ...aboveFold,
        shrineProtection,
        quests: {
          daily: aboveFold.quests.daily,
          weekly: quests.weekly,
        },
      }}
      belowFold={
        <Suspense fallback={null}>
          <CampBelowFold belowFold={belowFold} />
        </Suspense>
      }
    />
  );
}
