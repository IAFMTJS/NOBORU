import type { PlayerKnowledgeContext } from "@/lib/learning/learning-architecture.types";

export const DAILY_CHALLENGE_PRIORITIES = [
  "recently_learned",
  "weak",
  "forgotten",
  "mastered_maintenance",
] as const;

export type DailyChallengePriority = (typeof DAILY_CHALLENGE_PRIORITIES)[number];

export type DailyChallengeItem = {
  vocabularyId: string;
  priority: DailyChallengePriority;
};

export type DailyChallengeSession = {
  goal: "retention";
  items: DailyChallengeItem[];
  totalCount: number;
};

export function buildDailyChallengeSession(
  context: PlayerKnowledgeContext,
  scheduledReviewIds: string[],
  limit = 15,
): DailyChallengeSession {
  const items: DailyChallengeItem[] = [];
  const seen = new Set<string>();

  const push = (vocabularyId: string, priority: DailyChallengePriority) => {
    if (seen.has(vocabularyId)) return;
    seen.add(vocabularyId);
    items.push({ vocabularyId, priority });
  };

  const recentlyLearned = context.activeVocabularyPool.filter(
    (id) =>
      context.knownVocabularyIds.includes(id) &&
      !context.masteredVocabularyIds.includes(id),
  );

  for (const id of recentlyLearned) {
    push(id, "recently_learned");
    if (items.length >= limit) break;
  }

  for (const id of context.weakVocabularyIds) {
    push(id, "weak");
    if (items.length >= limit) break;
  }

  for (const id of scheduledReviewIds) {
    push(id, "forgotten");
    if (items.length >= limit) break;
  }

  for (const id of context.masteredVocabularyIds) {
    push(id, "mastered_maintenance");
    if (items.length >= limit) break;
  }

  return {
    goal: "retention",
    items: items.slice(0, limit),
    totalCount: Math.min(items.length, limit),
  };
}
