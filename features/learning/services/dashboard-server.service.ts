import { FOOTHILLS_REGION } from "@/features/onboarding/constants/onboarding.constants";
import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";
import type { ProfileViewModel } from "@/features/profile/types/profile.types";
import { achievementService } from "@/features/achievements/services/achievement.service";
import { elevationService } from "@/features/elevation/services/elevation.service";
import { learningPathRepository } from "@/features/learning/repositories/learning-path.repository";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import { questService } from "@/features/quests/services/quest.service";
import { yamaService } from "@/features/yama/services/yama.service";
import { reviewRepository } from "@/features/review/repositories/review.repository";
import { flattenRegionTrailLessons } from "@/features/learning/utils/trail-state";
import { getCachedProgressRows } from "@/lib/cache/user-progress-cache";

const REGION_LABELS: Record<string, { name: string; trail: string }> = {
  foothills: {
    name: FOOTHILLS_REGION.name,
    trail: FOOTHILLS_REGION.trail,
  },
  "forest-trail": {
    name: "Forest Trail",
    trail: "Canopy Path",
  },
  "mount-n5": {
    name: "Mount N5",
    trail: "Summit Trail",
  },
  "mount-n4": {
    name: "Mount N4",
    trail: "Ascent Trail",
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
    const region = getRegionDisplay(profile.currentRegionSlug);

    const [regions, progressRows, reviewQueueCount, elevation, recentAchievements, quests, passedTrialSlugs] =
      await Promise.all([
        learningPathRepository.listPublishedRegionsWithCurriculum(),
        getCachedProgressRows(profile.userId),
        reviewRepository.countDue(profile.userId),
        elevationService.getSummary(profile.userId),
        achievementService.listRecentUnlocked(profile.userId),
        questService.getQuestDashboard(profile.userId),
        learningPathService.getPassedTrialSlugs(profile.userId),
      ]);

    const learningPath = learningPathService.buildLearningPath(
      regions,
      progressRows,
      passedTrialSlugs,
    );

    const currentRegionPath =
      learningPath.regions.find(
        (entry) => entry.slug === profile.currentRegionSlug,
      ) ?? learningPath.regions[0];

    const trailNodes = currentRegionPath
      ? flattenRegionTrailLessons(currentRegionPath.units, {
          regionLocked: currentRegionPath.availability === "locked",
        })
      : [];
    const trailStartIndex = Math.max(
      0,
      trailNodes.findIndex((node) => node.state !== "completed"),
    );
    const trailPreview = trailNodes.slice(trailStartIndex, trailStartIndex + 5);

    const yama = yamaService.resolveHomePresence(
      {
        dailyQuestsCompleted: quests.daily.completedCount,
        dailyQuestsTotal: quests.daily.totalCount,
        regionProgressPercent: currentRegionPath?.progressPercent ?? 0,
        hasInProgressTrailNode: trailPreview.some(
          (node) => node.state === "in_progress",
        ),
      },
      profile.userId.length,
    );

    return {
      greeting: `Konnichiwa, ${profile.displayName}`,
      region,
      level: {
        label: profile.levelLabel,
        progressPercent: currentRegionPath?.progressPercent ?? 0,
      },
      elevation: {
        level: elevation.currentLevel,
        totalEp: elevation.totalEp,
        currentEp: elevation.currentEp,
        epToNextLevel: elevation.epToNextLevel,
        progressPercent: elevation.levelProgressPercent,
        activeTitle: elevation.activeTitle,
        nextMilestone: elevation.nextReward
          ? `Level ${elevation.nextReward.level}: ${elevation.nextReward.title}`
          : "Summit reached",
      },
      quests,
      yama,
      trailPreview,
      upcomingLesson: {
        title: learningPath.nextLesson?.title ?? "Explore the learning path",
        href: learningPath.nextLessonHref ?? "/learn",
      },
      recentAchievements: recentAchievements.map((achievement) => ({
        id: achievement.id,
        title: achievement.name,
        rarity: achievement.rarity,
      })),
      reviewQueueCount,
    };
  }
}

export const dashboardServerService = new DashboardServerService();
