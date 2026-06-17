import type {
  ActiveVocabularyPool,
  ActiveVocabularyPoolInput,
  ContentKnowledgeId,
} from "@/lib/learning/learning-architecture.types";

function uniqueIds(ids: ContentKnowledgeId[]): ContentKnowledgeId[] {
  return Array.from(new Set(ids));
}

/**
 * Builds the player's Active Vocabulary Pool per the Learning Architecture Bible.
 * Pool = current chapter + previous chapter + recently learned + scheduled review.
 */
export function buildActiveVocabularyPool(
  input: ActiveVocabularyPoolInput,
): ActiveVocabularyPool {
  const currentChapter = uniqueIds(input.currentChapterVocabularyIds);
  const previousChapter = uniqueIds(input.previousChapterVocabularyIds);
  const recentlyLearned = uniqueIds(input.recentlyLearnedVocabularyIds);
  const scheduledReview = uniqueIds(input.scheduledReviewVocabularyIds);

  const vocabularyIds = uniqueIds([
    ...currentChapter,
    ...previousChapter,
    ...recentlyLearned,
    ...scheduledReview,
  ]);

  return {
    vocabularyIds,
    size: vocabularyIds.length,
    bySource: {
      currentChapter: currentChapter.length,
      previousChapter: previousChapter.length,
      recentlyLearned: recentlyLearned.length,
      scheduledReview: scheduledReview.length,
    },
  };
}

export function isInActiveVocabularyPool(
  vocabularyId: ContentKnowledgeId,
  pool: ActiveVocabularyPool,
): boolean {
  return pool.vocabularyIds.includes(vocabularyId);
}
