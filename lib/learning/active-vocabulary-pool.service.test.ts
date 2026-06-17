import { describe, expect, it } from "vitest";

import {
  buildActiveVocabularyPool,
  isInActiveVocabularyPool,
} from "@/lib/learning/active-vocabulary-pool.service";

describe("buildActiveVocabularyPool", () => {
  it("deduplicates ids across pool sources", () => {
    const pool = buildActiveVocabularyPool({
      currentChapterVocabularyIds: ["a", "b", "c"],
      previousChapterVocabularyIds: ["b", "d"],
      recentlyLearnedVocabularyIds: ["c", "e"],
      scheduledReviewVocabularyIds: ["a", "f"],
    });

    expect(pool.vocabularyIds).toEqual(["a", "b", "c", "d", "e", "f"]);
    expect(pool.size).toBe(6);
    expect(pool.bySource).toEqual({
      currentChapter: 3,
      previousChapter: 2,
      recentlyLearned: 2,
      scheduledReview: 2,
    });
  });

  it("reports membership in the active pool", () => {
    const pool = buildActiveVocabularyPool({
      currentChapterVocabularyIds: ["word-1"],
      previousChapterVocabularyIds: [],
      recentlyLearnedVocabularyIds: [],
      scheduledReviewVocabularyIds: [],
    });

    expect(isInActiveVocabularyPool("word-1", pool)).toBe(true);
    expect(isInActiveVocabularyPool("word-2", pool)).toBe(false);
  });
});
