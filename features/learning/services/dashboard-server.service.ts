import { FOOTHILLS_REGION } from "@/features/onboarding/constants/onboarding.constants";
import { PLACEHOLDER_HOME_DASHBOARD } from "@/features/learning/constants/placeholder-dashboard";
import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";
import type { ProfileViewModel } from "@/features/profile/types/profile.types";
import { settingsServerRepository } from "@/features/settings/repositories/settings-server.repository";

const REGION_LABELS: Record<string, { name: string; trail: string }> = {
  foothills: {
    name: FOOTHILLS_REGION.name,
    trail: FOOTHILLS_REGION.trail,
  },
};

function getRegionDisplay(slug: string) {
  return (
    REGION_LABELS[slug] ?? {
      name: "Foothills",
      trail: "Base Camp Trail",
    }
  );
}

class DashboardServerService {
  async getHomeDashboard(
    profile: ProfileViewModel,
  ): Promise<HomeDashboardViewModel> {
    const settings = await settingsServerRepository.ensureSettings(profile.userId);
    const region = getRegionDisplay(profile.currentRegionSlug);
    const dailyTarget = settings.daily_goal;

    return {
      greeting: `Konnichiwa, ${profile.displayName}`,
      region,
      level: {
        label: profile.levelLabel,
        progressPercent: 0,
      },
      elevation: {
        current: 0,
        nextMilestone: "First Summit Marker",
      },
      dailyQuest: {
        title: "Today's Quest",
        description: `Climb for ${dailyTarget} minutes`,
        current: 0,
        target: dailyTarget,
      },
      upcomingLesson: {
        title: "Lesson 1: Hiragana — あ row",
        href: "/learn",
      },
      recentAchievements: [],
      reviewQueueCount: PLACEHOLDER_HOME_DASHBOARD.reviewQueueCount,
    };
  }
}

export const dashboardServerService = new DashboardServerService();
