import {
  ACHIEVEMENT_EP_BY_RARITY,
  ACHIEVEMENT_SLUGS,
  MOUNT_N5_REGION_SLUG,
  RECENT_ACHIEVEMENTS_LIMIT,
} from "@/features/achievements/constants/achievement.constants";
import { achievementRepository } from "@/features/achievements/repositories/achievement.repository";
import { userAchievementRepository } from "@/features/achievements/repositories/user-achievement.repository";
import { streakService } from "@/features/achievements/services/streak.service";
import type {
  AchievementEvaluationSnapshot,
  AchievementRow,
  AchievementShowcaseViewModel,
  AchievementUnlockViewModel,
  AchievementViewModel,
} from "@/features/achievements/types/achievement.types";
import { elevationService } from "@/features/elevation/services/elevation.service";
import { kanjiRepository } from "@/features/kanji/repositories/kanji.repository";
import { getCachedProgressRows } from "@/lib/cache/user-progress-cache";
import { learningPathRepository } from "@/features/learning/repositories/learning-path.repository";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import { profileServerRepository } from "@/features/profile/repositories/profile-server.repository";
import { vocabularyRepository } from "@/features/vocabulary/repositories/vocabulary.repository";

function resolveEpAmount(achievement: AchievementRow): number {
  if (
    achievement.reward_type === "ep" &&
    achievement.reward_value !== null &&
    achievement.reward_value > 0
  ) {
    return achievement.reward_value;
  }

  return ACHIEVEMENT_EP_BY_RARITY[achievement.rarity];
}

function isTriggerMet(
  achievement: AchievementRow,
  snapshot: AchievementEvaluationSnapshot,
): boolean {
  switch (achievement.slug) {
    case ACHIEVEMENT_SLUGS.firstStep:
      return snapshot.onboardingCompleted;
    case ACHIEVEMENT_SLUGS.firstLesson:
      return snapshot.lessonsCompleted >= 1;
    case ACHIEVEMENT_SLUGS.tenLessons:
      return snapshot.lessonsCompleted >= 10;
    case ACHIEVEMENT_SLUGS.hundredWords:
      return snapshot.vocabularyLearned >= 100;
    case ACHIEVEMENT_SLUGS.fiftyKanji:
      return snapshot.kanjiLearned >= 50;
    case ACHIEVEMENT_SLUGS.sevenDayStreak:
      return snapshot.currentStreak >= 7;
    case ACHIEVEMENT_SLUGS.n5Completed:
      return (
        snapshot.mountN5LessonCount > 0 &&
        snapshot.mountN5ProgressPercent === 100
      );
    default:
      return false;
  }
}

function mapAchievementViewModel(
  achievement: AchievementRow,
  unlockedAt: string | null,
): AchievementViewModel {
  return {
    id: achievement.id,
    slug: achievement.slug,
    name: achievement.name,
    description: achievement.description,
    rarity: achievement.rarity,
    unlocked: unlockedAt !== null,
    unlockedAt,
  };
}

class AchievementService {
  async buildEvaluationSnapshot(
    userId: string,
  ): Promise<AchievementEvaluationSnapshot> {
    const [
      profile,
      progressRows,
      regions,
      vocabularyLearned,
      kanjiLearned,
      currentStreak,
    ] = await Promise.all([
      profileServerRepository.findByUserId(userId),
      getCachedProgressRows(userId),
      learningPathRepository.listPublishedRegionsWithCurriculum(),
      vocabularyRepository.listLearnedVocabularyIds(userId),
      kanjiRepository.listLearnedKanjiIds(userId),
      streakService.getCurrentStreak(userId),
    ]);

    const learningPath = learningPathService.buildLearningPath(
      regions,
      progressRows,
    );
    const mountN5 = learningPath.regions.find(
      (region) => region.slug === MOUNT_N5_REGION_SLUG,
    );

    const lessonsCompleted = progressRows.filter(
      (row) => row.status === "completed",
    ).length;

    return {
      onboardingCompleted: profile?.onboarding_completed ?? false,
      lessonsCompleted,
      vocabularyLearned: vocabularyLearned.length,
      kanjiLearned: kanjiLearned.length,
      currentStreak,
      mountN5ProgressPercent: mountN5?.progressPercent ?? 0,
      mountN5LessonCount: mountN5?.lessonCount ?? 0,
    };
  }

  async evaluateAndUnlock(userId: string): Promise<AchievementUnlockViewModel[]> {
    const [published, unlockedIds, snapshot] = await Promise.all([
      achievementRepository.listPublished(),
      userAchievementRepository.listUnlockedAchievementIds(userId),
      this.buildEvaluationSnapshot(userId),
    ]);

    const newlyUnlocked: AchievementUnlockViewModel[] = [];

    for (const achievement of published) {
      if (unlockedIds.has(achievement.id)) continue;
      if (!isTriggerMet(achievement, snapshot)) continue;

      const unlock = await this.unlockAchievement(userId, achievement);
      if (unlock) newlyUnlocked.push(unlock);
    }

    return newlyUnlocked;
  }

  async afterStudyActivity(userId: string): Promise<AchievementUnlockViewModel[]> {
    await streakService.recordStudyActivity(userId);
    return this.evaluateAndUnlock(userId);
  }

  async unlockAchievement(
    userId: string,
    achievement: AchievementRow,
  ): Promise<AchievementUnlockViewModel | null> {
    const alreadyUnlocked = await userAchievementRepository.hasUnlocked(
      userId,
      achievement.id,
    );
    if (alreadyUnlocked) return null;

    const row = await userAchievementRepository.insertUnlock(
      userId,
      achievement.id,
    );
    const epAmount = resolveEpAmount(achievement);

    const elevation = await elevationService.awardEp({
      userId,
      sourceType: "achievement",
      sourceId: achievement.id,
      amount: epAmount,
      description: `Achievement unlocked: ${achievement.name}`,
    });

    return {
      id: achievement.id,
      slug: achievement.slug,
      name: achievement.name,
      description: achievement.description,
      rarity: achievement.rarity,
      unlockedAt: row.unlocked_at,
      epAwarded: epAmount,
      elevation,
    };
  }

  async listRecentUnlocked(
    userId: string,
    limit = RECENT_ACHIEVEMENTS_LIMIT,
  ): Promise<AchievementViewModel[]> {
    await this.evaluateAndUnlock(userId);

    const rows = await userAchievementRepository.listRecentWithDefinitions(
      userId,
      limit,
    );

    return rows.map((row) =>
      mapAchievementViewModel(row.achievement, row.unlocked_at),
    );
  }

  async getShowcase(userId: string): Promise<AchievementShowcaseViewModel> {
    await this.evaluateAndUnlock(userId);

    const [published, unlockedRows] = await Promise.all([
      achievementRepository.listPublished(),
      userAchievementRepository.listAllWithDefinitions(userId),
    ]);

    const unlockedById = new Map(
      unlockedRows.map((row) => [row.achievement_id, row.unlocked_at]),
    );

    const unlocked: AchievementViewModel[] = [];
    const locked: AchievementViewModel[] = [];

    for (const achievement of published) {
      const unlockedAt = unlockedById.get(achievement.id) ?? null;
      const viewModel = mapAchievementViewModel(achievement, unlockedAt);
      if (unlockedAt) {
        unlocked.push(viewModel);
      } else {
        locked.push(viewModel);
      }
    }

    unlocked.sort((left, right) =>
      (right.unlockedAt ?? "").localeCompare(left.unlockedAt ?? ""),
    );

    return {
      unlocked,
      locked,
      totalUnlocked: unlocked.length,
      totalAvailable: published.length,
    };
  }
}

export const achievementService = new AchievementService();
