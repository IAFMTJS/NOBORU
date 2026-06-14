import type { ReviewRating } from "@/features/review/types/review.types";
import {
  calculateLevelFromTotalEp,
  epRequiredForNextLevel,
  levelProgressPercent,
  type ElevationSourceType,
} from "@/features/elevation/constants/elevation.constants";
import { elevationRepository } from "@/features/elevation/repositories/elevation.repository";
import type {
  ElevationAwardViewModel,
  ElevationSummaryViewModel,
  LevelRewardRow,
  LevelRewardViewModel,
} from "@/features/elevation/types/elevation.types";

function mapReward(row: LevelRewardRow): LevelRewardViewModel {
  return {
    level: row.level,
    title: row.title,
    description: row.description,
    rewardType: row.reward_type,
  };
}

class ElevationService {
  async getSummary(userId: string): Promise<ElevationSummaryViewModel> {
    const row = await elevationRepository.ensureElevation(userId);
    const [rewardsUpToLevel, nextReward] = await Promise.all([
      elevationRepository.listRewardsUpToLevel(row.current_level),
      elevationRepository.findNextRewardAboveLevel(row.current_level),
    ]);

    const activeTitle =
      [...rewardsUpToLevel].reverse().find((reward) => reward.reward_type === "title")
        ?.title ?? null;

    return {
      currentLevel: row.current_level,
      currentEp: row.current_ep,
      totalEp: row.total_ep,
      epToNextLevel: epRequiredForNextLevel(row.current_level),
      levelProgressPercent: levelProgressPercent(row.current_level, row.current_ep),
      activeTitle,
      nextReward: nextReward ? mapReward(nextReward) : null,
      recentRewards: rewardsUpToLevel.slice(-3).map(mapReward),
    };
  }

  async awardEp(input: {
    userId: string;
    sourceType: ElevationSourceType;
    sourceId?: string | null;
    amount: number;
    description: string;
  }): Promise<ElevationAwardViewModel | null> {
    if (input.amount <= 0) return null;

    const current = await elevationRepository.ensureElevation(input.userId);
    const oldLevel = current.current_level;
    const newTotalEp = current.total_ep + input.amount;
    const { level, currentEp } = calculateLevelFromTotalEp(newTotalEp);

    await elevationRepository.updateElevation({
      userId: input.userId,
      currentLevel: level,
      currentEp,
      totalEp: newTotalEp,
    });

    await elevationRepository.insertEvent({
      userId: input.userId,
      sourceType: input.sourceType,
      sourceId: input.sourceId ?? null,
      epAmount: input.amount,
      description: input.description,
    });

    const rewardsUnlocked: LevelRewardViewModel[] = [];
    if (level > oldLevel) {
      for (let rewardLevel = oldLevel + 1; rewardLevel <= level; rewardLevel += 1) {
        const reward = await elevationRepository.findRewardForLevel(rewardLevel);
        if (reward) rewardsUnlocked.push(mapReward(reward));
      }
    }

    return {
      epAwarded: input.amount,
      totalEp: newTotalEp,
      currentLevel: level,
      currentEp,
      epToNextLevel: epRequiredForNextLevel(level),
      levelProgressPercent: levelProgressPercent(level, currentEp),
      leveledUp: level > oldLevel,
      rewardsUnlocked,
    };
  }

  async awardLessonCompletion(
    userId: string,
    lessonId: string,
    lessonTitle: string,
    xpReward: number,
    isFirstCompletion: boolean,
  ): Promise<ElevationAwardViewModel | null> {
    if (!isFirstCompletion) return null;

    return this.awardEp({
      userId,
      sourceType: "lesson_complete",
      sourceId: lessonId,
      amount: xpReward,
      description: `Completed lesson: ${lessonTitle}`,
    });
  }

  async awardReviewRating(
    userId: string,
    reviewItemId: string,
    rating: ReviewRating,
    clientEventId?: string,
  ): Promise<ElevationAwardViewModel | null> {
    const normalized = rating === "strong" || rating === "easy" ? "easy" : rating;
    const amount =
      normalized === "easy" ? 5 : normalized === "good" ? 3 : normalized === "hard" ? 2 : 0;
    if (amount === 0) return null;

    return this.awardEp({
      userId,
      sourceType: "review_rating",
      sourceId: clientEventId ?? reviewItemId,
      amount,
      description: `Review rating: ${rating}`,
    });
  }

  async awardComprehensionComplete(
    userId: string,
    sourceType: "reading_complete" | "listening_complete",
    contentId: string,
    title: string,
    isFirstCompletion: boolean,
  ): Promise<ElevationAwardViewModel | null> {
    if (!isFirstCompletion) return null;

    return this.awardEp({
      userId,
      sourceType,
      sourceId: contentId,
      amount: 15,
      description: `Completed ${sourceType === "reading_complete" ? "reading" : "listening"}: ${title}`,
    });
  }
}

export const elevationService = new ElevationService();
