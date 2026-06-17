import type { JlptLevel } from "@/lib/content/types";
import type { LessonContent } from "@/features/learning/types/lesson.types";
import type { CheckpointActivityPlan } from "@/lib/learning/checkpoint-assembly.service";
import {
  NEW_CONTENT_RATIO,
  getVocabIntroLimit,
} from "@/lib/learning/learning-architecture.constants";
import { mixSessionItems } from "@/lib/learning/session-mixer.service";

export type LessonExerciseCandidate = {
  id: string;
  content: LessonContent;
  isReview: boolean;
};

export function computeLessonExerciseSlotCount(newItemCount: number): number {
  if (newItemCount <= 0) return 0;
  return Math.max(newItemCount, Math.ceil(newItemCount / NEW_CONTENT_RATIO));
}

export function partitionLessonContentsByKnown(
  contents: LessonContent[],
  knownIds: ReadonlySet<string>,
): { newContents: LessonContent[]; knownContents: LessonContent[] } {
  const newContents: LessonContent[] = [];
  const knownContents: LessonContent[] = [];

  for (const content of contents) {
    if (knownIds.has(content.id)) {
      knownContents.push(content);
    } else {
      newContents.push(content);
    }
  }

  return { newContents, knownContents };
}

/**
 * Caps newly introduced vocabulary per mini chapter (lesson) for the player's JLPT level.
 * Already-known vocabulary in the lesson is always retained for reinforcement.
 */
export function capNewVocabularyInLessonContents(
  contents: LessonContent[],
  jlptLevel: JlptLevel,
  knownVocabularyIds: ReadonlySet<string>,
): LessonContent[] {
  const introLimit = getVocabIntroLimit(jlptLevel);
  let newVocabularyCount = 0;
  const capped: LessonContent[] = [];

  for (const content of contents) {
    if (content.type !== "vocabulary") {
      capped.push(content);
      continue;
    }

    if (knownVocabularyIds.has(content.id)) {
      capped.push(content);
      continue;
    }

    if (newVocabularyCount >= introLimit) continue;

    newVocabularyCount += 1;
    capped.push(content);
  }

  return capped;
}

export function planLessonExerciseCandidates(
  newContents: LessonContent[],
  reviewContents: LessonContent[],
): LessonExerciseCandidate[] {
  const totalSlots = computeLessonExerciseSlotCount(newContents.length);
  if (totalSlots === 0) {
    return reviewContents.map((content) => ({
      id: content.id,
      content,
      isReview: true,
    }));
  }

  const reviewCandidates: LessonExerciseCandidate[] = reviewContents.map((content) => ({
    id: content.id,
    content,
    isReview: true,
  }));
  const newCandidates: LessonExerciseCandidate[] = newContents.map((content) => ({
    id: content.id,
    content,
    isReview: false,
  }));

  return mixSessionItems(reviewCandidates, newCandidates, totalSlots);
}

export function buildCheckpointExerciseCandidates(
  plans: CheckpointActivityPlan[],
  contentsById: ReadonlyMap<string, LessonContent>,
  activityMix?: readonly string[] | null,
): LessonExerciseCandidate[] {
  const selectedPlans =
    activityMix && activityMix.length > 0
      ? activityMix
          .map((type) => plans.find((plan) => plan.type === type))
          .filter((plan): plan is CheckpointActivityPlan => plan != null)
      : plans;

  const seen = new Set<string>();
  const candidates: LessonExerciseCandidate[] = [];

  for (const plan of selectedPlans) {
    for (const contentId of plan.contentIds) {
      if (seen.has(contentId)) continue;
      const content = contentsById.get(contentId);
      if (!content) continue;
      seen.add(contentId);
      candidates.push({ id: content.id, content, isReview: true });
    }
  }

  return candidates;
}

export function extractExerciseContents(
  candidates: LessonExerciseCandidate[],
): LessonContent[] {
  return candidates.map((candidate) => candidate.content);
}
