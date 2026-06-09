import { FOOTHILLS_REGION } from "@/features/onboarding/constants/onboarding.constants";
import { lessonService } from "@/features/learning/services/lesson.service";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";
import type { ProfileViewModel } from "@/features/profile/types/profile.types";
import { reviewRepository } from "@/features/review/repositories/review.repository";
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
    const [nextLesson, learningPath, reviewQueueCount] = await Promise.all([
      lessonService.getNextIncompleteLesson(profile.userId),
      learningPathService.getLearningPath(profile.userId),
      reviewRepository.countDue(profile.userId),
    ]);

    const foothills = learningPath.regions.find(
      (entry) => entry.slug === FOOTHILLS_REGION.slug,
    );

    return {
      greeting: `Konnichiwa, ${profile.displayName}`,
      region,
      level: {
        label: profile.levelLabel,
        progressPercent: foothills?.progressPercent ?? 0,
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
        title: nextLesson?.title ?? "Explore the learning path",
        href: nextLesson ? `/learn/lesson/${nextLesson.id}` : "/learn",
      },
      recentAchievements: [],
      reviewQueueCount,
    };
  }
}

export const dashboardServerService = new DashboardServerService();
