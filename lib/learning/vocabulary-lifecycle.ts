import type { ReviewState } from "@/features/review/repositories/review.repository";

import {
  type VocabularyLifecycleStage,
  MASTERY_MIN_CORRECT_ANSWERS,
  MASTERY_MIN_DISTINCT_DAYS,
  MASTERY_MIN_EXERCISE_TYPES,
  MASTERY_MIN_SESSIONS,
} from "@/lib/learning/learning-architecture.constants";
import type {
  WordMasteryEvaluation,
  WordMasteryStats,
} from "@/lib/learning/learning-architecture.types";

/** Maps SRS review state to the closest bible lifecycle stage. */
export function mapReviewStateToLifecycleStage(
  state: ReviewState,
): VocabularyLifecycleStage {
  switch (state) {
    case "new":
      return "unknown";
    case "learning":
      return "discovered";
    case "good":
      return "recognized";
    case "strong":
      return "applied";
    case "mastered":
      return "mastered";
    case "legendary":
      return "maintained";
    default:
      return "unknown";
  }
}

export function evaluateWordMastery(stats: WordMasteryStats): WordMasteryEvaluation {
  const gaps: string[] = [];

  if (stats.correctAnswerCount < MASTERY_MIN_CORRECT_ANSWERS) {
    gaps.push(
      `correct answers (${stats.correctAnswerCount}/${MASTERY_MIN_CORRECT_ANSWERS})`,
    );
  }
  if (stats.distinctExerciseTypes < MASTERY_MIN_EXERCISE_TYPES) {
    gaps.push(
      `exercise types (${stats.distinctExerciseTypes}/${MASTERY_MIN_EXERCISE_TYPES})`,
    );
  }
  if (stats.distinctSessionCount < MASTERY_MIN_SESSIONS) {
    gaps.push(
      `sessions (${stats.distinctSessionCount}/${MASTERY_MIN_SESSIONS})`,
    );
  }
  if (stats.distinctDayCount < MASTERY_MIN_DISTINCT_DAYS) {
    gaps.push(`days (${stats.distinctDayCount}/${MASTERY_MIN_DISTINCT_DAYS})`);
  }

  const meetsBibleRequirements = gaps.length === 0;
  const lifecycleStage: VocabularyLifecycleStage = meetsBibleRequirements
    ? "mastered"
    : stats.correctAnswerCount > 0
      ? "reinforced"
      : "recognized";

  return {
    meetsBibleRequirements,
    lifecycleStage,
    gaps,
  };
}
