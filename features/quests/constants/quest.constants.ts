export const QUEST_SLUGS = {
  learnVocabulary: "learn-vocabulary",
  completeLessons: "complete-lessons",
  reviewItems: "review-items",
  earnEp: "earn-ep",
  weeklyCompleteLessons: "weekly-complete-lessons",
  weeklyReviewItems: "weekly-review-items",
} as const;

/** Four daily quests per gamification MVP. */
export const DAILY_QUEST_SLUGS = [
  QUEST_SLUGS.learnVocabulary,
  QUEST_SLUGS.completeLessons,
  QUEST_SLUGS.reviewItems,
  QUEST_SLUGS.earnEp,
] as const;

export const WEEKLY_QUEST_SLUGS = [
  QUEST_SLUGS.weeklyCompleteLessons,
  QUEST_SLUGS.weeklyReviewItems,
] as const;

export type QuestPeriod = "daily" | "weekly";

export type QuestDeepLinks = {
  lessonHref: string;
  reviewHref: string;
};

export type QuestMetric =
  | "learn_vocabulary"
  | "complete_lessons"
  | "review_items"
  | "earn_ep";

export type QuestActivityEvent =
  | { type: "lesson_complete"; amount?: number }
  | { type: "vocabulary_learned"; amount: number }
  | { type: "review_item"; amount?: number }
  | { type: "trial_complete"; amount?: number }
  | { type: "ep_earned"; amount: number };

export function resolveQuestHref(
  slug: string,
  links: QuestDeepLinks,
): string {
  switch (slug) {
    case QUEST_SLUGS.learnVocabulary:
    case QUEST_SLUGS.completeLessons:
    case QUEST_SLUGS.earnEp:
    case QUEST_SLUGS.weeklyCompleteLessons:
      return links.lessonHref;
    case QUEST_SLUGS.reviewItems:
    case QUEST_SLUGS.weeklyReviewItems:
      return links.reviewHref;
    default:
      return links.lessonHref;
  }
}
