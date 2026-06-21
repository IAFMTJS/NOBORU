import type { ReviewRating } from "@/features/review/types/review.types";
import {
  calculateLevelFromTotalEp,
  epRequiredForNextLevel,
  levelProgressPercent,
  type ElevationSourceType,
} from "@/features/elevation/constants/elevation.constants";
import { elevationRepository } from "@/features/elevation/repositories/elevation.repository";
import { revalidateUserElevation } from "@/lib/cache/revalidate-user-data";
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

export type EpAwardInput = {
  sourceType: ElevationSourceType;
  sourceId?: string | null;
  amount: number;
  description: string;
};

function buildElevationAwardViewModel(input: {
  epAwarded: number;
  oldLevel: number;
  level: number;
  currentEp: number;
  totalEp: number;
  rewardsUnlocked: LevelRewardViewModel[];
}): ElevationAwardViewModel {
  return {
    epAwarded: input.epAwarded,
    totalEp: input.totalEp,
    currentLevel: input.level,
    currentEp: input.currentEp,
    epToNextLevel: epRequiredForNextLevel(input.level),
    levelProgressPercent: levelProgressPercent(input.level, input.currentEp),
    leveledUp: input.level > input.oldLevel,
    rewardsUnlocked: input.rewardsUnlocked,
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
    const result = await this.awardEpBatch({
      userId: input.userId,
      awards: [
        {
          sourceType: input.sourceType,
          sourceId: input.sourceId,
          amount: input.amount,
          description: input.description,
        },
      ],
    });

    return result;
  }

  async awardEpBatch(input: {
    userId: string;
    awards: EpAwardInput[];
  }): Promise<ElevationAwardViewModel | null> {
    const awards = input.awards.filter((award) => award.amount > 0);
    if (awards.length === 0) return null;

    const totalAwarded = awards.reduce((sum, award) => sum + award.amount, 0);
    const current = await elevationRepository.ensureElevation(input.userId);
    const oldLevel = current.current_level;
    const newTotalEp = current.total_ep + totalAwarded;
    const { level, currentEp } = calculateLevelFromTotalEp(newTotalEp);

    await elevationRepository.updateElevation({
      userId: input.userId,
      currentLevel: level,
      currentEp,
      totalEp: newTotalEp,
    });

    await elevationRepository.insertEvents(
      awards.map((award) => ({
        userId: input.userId,
        sourceType: award.sourceType,
        sourceId: award.sourceId ?? null,
        epAmount: award.amount,
        description: award.description,
      })),
    );

    const rewardsUnlocked: LevelRewardViewModel[] = [];
    if (level > oldLevel) {
      const rewards = await elevationRepository.listRewardsForLevelRange(
        oldLevel + 1,
        level,
      );
      rewardsUnlocked.push(...rewards.map(mapReward));
    }

    revalidateUserElevation(input.userId);

    return buildElevationAwardViewModel({
      epAwarded: totalAwarded,
      oldLevel,
      level,
      currentEp,
      totalEp: newTotalEp,
      rewardsUnlocked,
    });
  }

  resolveReviewRatingEp(rating: ReviewRating): number {
    const normalized = rating === "strong" || rating === "easy" ? "easy" : rating;
    if (normalized === "easy") return 5;
    if (normalized === "good") return 3;
    if (normalized === "hard") return 2;
    return 0;
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
    const amount = this.resolveReviewRatingEp(rating);
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
