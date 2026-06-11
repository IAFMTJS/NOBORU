import { FOOTHILLS_REGION } from "@/features/onboarding/constants/onboarding.constants";
import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";
import type { ProfileViewModel } from "@/features/profile/types/profile.types";
import { achievementService } from "@/features/achievements/services/achievement.service";
import { streakService } from "@/features/achievements/services/streak.service";
import { elevationService } from "@/features/elevation/services/elevation.service";
import { learningPathRepository } from "@/features/learning/repositories/learning-path.repository";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import { questService } from "@/features/quests/services/quest.service";
import { yamaService } from "@/features/yama/services/yama.service";
import { gameContentRepository } from "@/features/games/repositories/game-content.repository";
import { reviewRepository } from "@/features/review/repositories/review.repository";
import { settingsServerService } from "@/features/settings/services/settings-server.service";
import { trialService } from "@/features/trials/services/trial.service";
import { getLessonPositionInRegion } from "@/features/learning/utils/region-lesson";
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
  const display =
    REGION_LABELS[slug] ?? {
      name: "Foothills",
      trail: "Base Camp Trail",
    };
  return { slug, ...display };
}

class DashboardServerService {
  async getHomeDashboard(
    profile: ProfileViewModel,
  ): Promise<HomeDashboardViewModel> {
    const region = getRegionDisplay(profile.currentRegionSlug);

    const [
      regions,
      progressRows,
      reviewQueueCount,
      elevation,
      recentAchievements,
      quests,
      passedTrialSlugs,
      trials,
      gamesUnlocked,
      settings,
      currentStreak,
    ] = await Promise.all([
      learningPathRepository.listPublishedRegionsWithCurriculum(),
      getCachedProgressRows(profile.userId),
      reviewRepository.countDue(profile.userId),
      elevationService.getSummary(profile.userId),
      achievementService.listRecentUnlocked(profile.userId),
      questService.getQuestDashboard(profile.userId),
      learningPathService.getPassedTrialSlugs(profile.userId),
      trialService.listTrials(profile.userId),
      gameContentRepository.hasUnlockedGames(profile.userId),
      settingsServerService.getSettings(),
      streakService.getCurrentStreak(profile.userId),
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

    const readyTrial = trials.find((trial) => trial.availability === "available");
    const regionForNextLesson = learningPath.nextLesson
      ? (learningPath.regions.find((entry) =>
          entry.units.some((unit) =>
            unit.lessons.some((lesson) => lesson.id === learningPath.nextLesson?.id),
          ),
        ) ?? currentRegionPath)
      : currentRegionPath;
    const lessonPosition =
      learningPath.nextLesson && regionForNextLesson
        ? getLessonPositionInRegion(regionForNextLesson, learningPath.nextLesson.id)
        : null;

    return {
      greeting: `Kon'nichiwa, ${profile.displayName}`,
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
        lessonNumber: lessonPosition?.index ?? null,
        lessonCount: regionForNextLesson?.lessonCount ?? 0,
        estimatedDuration: learningPath.nextLesson?.estimatedDuration ?? null,
      },
      stats: {
        currentStreak,
        totalXp: elevation.totalEp,
      },
      recentAchievements: recentAchievements.map((achievement) => ({
        id: achievement.id,
        slug: achievement.slug,
        title: achievement.name,
        rarity: achievement.rarity,
      })),
      reviewQueueCount,
      readyTrial: readyTrial
        ? {
            title: readyTrial.title,
            href: `/trials/${readyTrial.slug}`,
          }
        : null,
      gamesAvailable: gamesUnlocked,
      dailyGoal: {
        targetMinutes: settings?.dailyGoalMinutes ?? 15,
        progressPercent:
          quests.daily.totalCount === 0
            ? 0
            : Math.round(
                (quests.daily.completedCount / quests.daily.totalCount) * 100,
              ),
        label: `${quests.daily.completedCount}/${quests.daily.totalCount} daily quests`,
      },
    };
  }
}

export const dashboardServerService = new DashboardServerService();
