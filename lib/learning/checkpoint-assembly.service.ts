import {
  CHECKPOINT_MINI_CHAPTERS_MAX,
  CHECKPOINT_MINI_CHAPTERS_MIN,
} from "@/lib/learning/learning-architecture.constants";

export const CHECKPOINT_ACTIVITY_TYPES = [
  "vocabulary_recognition",
  "listening",
  "reading",
  "writing",
  "context_usage",
  "mixed_activities",
] as const;

export type CheckpointActivityType = (typeof CHECKPOINT_ACTIVITY_TYPES)[number];

export type CheckpointActivityPlan = {
  type: CheckpointActivityType;
  contentIds: string[];
  isReview: boolean;
};

export function shouldInsertCheckpointAfterMiniChapter(
  completedMiniChaptersInBranch: number,
): boolean {
  return (
    completedMiniChaptersInBranch >= CHECKPOINT_MINI_CHAPTERS_MIN &&
    completedMiniChaptersInBranch % CHECKPOINT_MINI_CHAPTERS_MIN === 0
  );
}

export function planCheckpointActivities(input: {
  vocabularyIds: string[];
  listeningIds: string[];
  readingIds: string[];
  applicationIds: string[];
  grammarIds: string[];
}): CheckpointActivityPlan[] {
  const plans: CheckpointActivityPlan[] = [];

  if (input.vocabularyIds.length > 0) {
    plans.push({
      type: "vocabulary_recognition",
      contentIds: input.vocabularyIds.slice(0, 6),
      isReview: true,
    });
  }
  if (input.listeningIds.length > 0) {
    plans.push({
      type: "listening",
      contentIds: input.listeningIds.slice(0, 2),
      isReview: true,
    });
  }
  if (input.readingIds.length > 0) {
    plans.push({
      type: "reading",
      contentIds: input.readingIds.slice(0, 2),
      isReview: true,
    });
  }
  if (input.applicationIds.length > 0) {
    plans.push({
      type: "writing",
      contentIds: input.applicationIds.slice(0, 2),
      isReview: true,
    });
  }
  if (input.grammarIds.length > 0) {
    plans.push({
      type: "context_usage",
      contentIds: input.grammarIds.slice(0, 2),
      isReview: true,
    });
  }

  const mixedIds = [
    ...input.vocabularyIds.slice(0, 3),
    ...input.grammarIds.slice(0, 1),
    ...input.readingIds.slice(0, 1),
  ];
  if (mixedIds.length >= 2) {
    plans.push({
      type: "mixed_activities",
      contentIds: mixedIds,
      isReview: true,
    });
  }

  return plans;
}

export function checkpointCadenceLabel(): string {
  return `${CHECKPOINT_MINI_CHAPTERS_MIN}-${CHECKPOINT_MINI_CHAPTERS_MAX} mini chapters`;
}
