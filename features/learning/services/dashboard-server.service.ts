import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";
import type { ProfileViewModel } from "@/features/profile/types/profile.types";
import { achievementService } from "@/features/achievements/services/achievement.service";
import { streakService } from "@/features/achievements/services/streak.service";
import { learningPathRepository } from "@/features/learning/repositories/learning-path.repository";
import { journeyService } from "@/features/journey/services/journey.service";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import { yamaService } from "@/features/yama/services/yama.service";
import { gameContentRepository } from "@/features/games/repositories/game-content.repository";
import { reviewRepository } from "@/features/review/repositories/review.repository";
import { settingsServerService } from "@/features/settings/services/settings-server.service";
import { trialService } from "@/features/trials/services/trial.service";
import { companionService } from "@/features/companion/services/companion.service";
import { chestService } from "@/features/chests/services/chest.service";
import { collectibleService } from "@/features/collectibles/services/collectible.service";
import { shrineProtectionService } from "@/features/streak-protection/services/shrine-protection.service";
import { regionTrailHref } from "@/features/learning/utils/trail-navigation";
import { buildProgressionPreview } from "@/lib/progression/preview.service";
import { getLessonPositionInRegion } from "@/features/learning/utils/region-lesson";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";
import {
  getCachedElevationSummary,
  getCachedQuestDashboard,
} from "@/lib/cache/dashboard-cache";
import { getCachedProgressRows } from "@/lib/cache/user-progress-cache";

function resolveDashboardRegion(
  slug: string,
  regionName?: string,
): HomeDashboardViewModel["region"] {
  const visuals = getRegionVisuals(slug);
  return {
    slug,
    name: regionName ?? visuals.label,
    trail: visuals.label,
  };
}

class DashboardServerService {
  async getHomeDashboard(
    profile: ProfileViewModel,
  ): Promise<HomeDashboardViewModel> {
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
      companion,
      companionNext,
      collectibleNext,
      chestNext,
      chests,
      shrineProtection,
    ] = await Promise.all([
      learningPathRepository.listPublishedRegionsWithCurriculum(),
      getCachedProgressRows(profile.userId),
      reviewRepository.countDue(profile.userId),
      getCachedElevationSummary(profile.userId),
      achievementService.listRecentUnlocked(profile.userId),
      getCachedQuestDashboard(profile.userId),
      learningPathService.getPassedTrialSlugs(profile.userId),
      trialService.listTrials(profile.userId),
      gameContentRepository.hasUnlockedGames(profile.userId),
      settingsServerService.getSettings(),
      streakService.getCurrentStreak(profile.userId),
      companionService.getCompanion(profile.userId),
      companionService.getNextUnlock(profile.userId),
      collectibleService.getNextRegionCollectible(
        profile.userId,
        profile.currentRegionSlug,
      ),
      chestService.getNextEligibleChest(profile.userId),
      chestService.listEligible(profile.userId),
      shrineProtectionService.getSummary(profile.userId),
    ]);

    const learningPath = learningPathService.buildLearningPath(
      regions,
      progressRows,
      passedTrialSlugs,
    );
    const journeyPath = journeyService.buildJourneyPath(
      learningPath.regions,
      progressRows,
      passedTrialSlugs,
    );

    const activeRegionSlug = journeyPath.position.currentRegionSlug;
    const currentRegionPath =
      learningPath.regions.find((entry) => entry.slug === activeRegionSlug) ??
      learningPath.regions[0];
    const currentRegionJourney =
      journeyPath.regions.find((entry) => entry.slug === activeRegionSlug) ??
      journeyPath.regions[0];

    const region = resolveDashboardRegion(
      activeRegionSlug,
      currentRegionPath?.name,
    );

    const previewStartIndex = Math.max(
      0,
      (currentRegionJourney?.currentNodeIndex ?? 0) - 1,
    );
    const journeyPreview =
      currentRegionJourney?.nodes
        .filter((node) => node.kind !== "landmark")
        .slice(previewStartIndex, previewStartIndex + 5) ?? [];
    const currentJourneyNodeId = journeyPath.position.currentNodeId;

    const yama = yamaService.resolveHomePresence(
      {
        dailyQuestsCompleted: quests.daily.completedCount,
        dailyQuestsTotal: quests.daily.totalCount,
        regionProgressPercent: currentRegionPath?.progressPercent ?? 0,
        hasInProgressTrailNode: journeyPreview.some(
          (node) => node.state === "in_progress",
        ),
      },
      profile.userId.length,
    );

    const readyTrial = trials.find(
      (trial) => trial.availability === "available",
    );
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

    const progressionPreview = buildProgressionPreview({
      regionSlug: activeRegionSlug,
      learningPath,
      elevation,
      trials,
      companionNext,
      collectibleNext,
      chestNext,
    });

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
      journeyPreview,
      currentJourneyNodeId,
      upcomingLesson: {
        title: learningPath.nextLesson?.title ?? "Explore the learning path",
        href:
          journeyPath.nextLessonHref ??
          (activeRegionSlug ? regionTrailHref(activeRegionSlug) : "/tree"),
        lessonNumber: lessonPosition?.index ?? null,
        lessonCount: regionForNextLesson?.lessonCount ?? 0,
        estimatedDuration: learningPath.nextLesson?.estimatedDuration ?? null,
      },
      stats: {
        currentStreak,
        totalXp: elevation.totalEp,
      },
      recentAchievements: recentAchievements.map(
        (achievement: { id: string; slug: string; name: string; rarity: HomeDashboardViewModel["recentAchievements"][number]["rarity"] }) => ({
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
      companion,
      progressionPreview,
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
      chests,
      shrineProtection,
    };
  }
}

export const dashboardServerService = new DashboardServerService();
