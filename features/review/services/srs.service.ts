import type { ReviewState } from "@/features/review/repositories/review.repository";
import type { ReviewRating } from "@/features/review/types/review.types";

const LEARNING_INTERVAL_MINUTES = 10;
const DAY_INTERVALS = [1, 3, 7, 14, 30, 90, 180, 365] as const;

export type SrsScheduleResult = {
  state: ReviewState;
  nextReviewAt: Date;
  intervalDays: number;
  masteryScore: number;
  streakCount: number;
};

function normalizeRating(rating: ReviewRating): "again" | "hard" | "good" | "easy" {
  if (rating === "strong") return "easy";
  return rating;
}

export function applySrsRating(input: {
  state: ReviewState;
  rating: ReviewRating;
  masteryScore: number;
  streakCount: number;
  now?: Date;
}): SrsScheduleResult {
  const now = input.now ?? new Date();
  const rating = normalizeRating(input.rating);

  if (rating === "again") {
    const nextReviewAt = new Date(now);
    nextReviewAt.setMinutes(nextReviewAt.getMinutes() + LEARNING_INTERVAL_MINUTES);

    return {
      state: "learning",
      nextReviewAt,
      intervalDays: 0,
      masteryScore: Math.max(0, input.masteryScore - 15),
      streakCount: 0,
    };
  }

  const streakCount = input.streakCount + 1;
  const intervalOffset = rating === "easy" ? 1 : rating === "hard" ? -1 : 0;
  const intervalIndex = Math.max(
    0,
    Math.min(streakCount - 1 + intervalOffset, DAY_INTERVALS.length - 1),
  );
  const intervalDays = DAY_INTERVALS[intervalIndex];
  const nextReviewAt = new Date(now);
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

  const masteryDelta = rating === "easy" ? 12 : rating === "good" ? 8 : 4;
  const masteryScore = Math.min(100, input.masteryScore + masteryDelta);

  let state: ReviewState = "good";
  if (streakCount <= 1 && input.state === "new") {
    state = "learning";
  } else if (streakCount >= 3 || rating === "easy") {
    state = "strong";
  }
  if (masteryScore >= 90 && streakCount >= 5) {
    state = "mastered";
  }
  if (masteryScore >= 95 && streakCount >= 8) {
    state = "legendary";
  }

  return {
    state,
    nextReviewAt,
    intervalDays,
    masteryScore,
    streakCount,
  };
}

export function formatNextReviewLabel(
  nextReviewAt: string,
  intervalDays: number,
): string {
  const dueAt = new Date(nextReviewAt);
  const now = new Date();

  if (dueAt.getTime() <= now.getTime()) {
    return "Due now";
  }

  if (intervalDays === 0) {
    const minutes = Math.max(
      1,
      Math.round((dueAt.getTime() - now.getTime()) / (1000 * 60)),
    );
    return `Due in ${minutes} min`;
  }

  if (intervalDays === 1) {
    return "Due in 1 day";
  }

  return `Due in ${intervalDays} days`;
}

export function formatReviewStateLabel(state: ReviewState): string {
  switch (state) {
    case "new":
      return "New";
    case "learning":
      return "Learning";
    case "good":
      return "Good";
    case "strong":
      return "Strong";
    case "mastered":
      return "Mastered";
    case "legendary":
      return "Legendary";
    default:
      return state;
  }
}
