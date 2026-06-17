import { describe, expect, it } from "vitest";

import {
  getVocabIntroLimit,
  isWithinVocabIntroLimit,
  REVIEW_INTERVAL_DAYS,
  VOCAB_INTRO_LIMITS_BY_JLPT,
} from "@/lib/learning/learning-architecture.constants";

describe("learning architecture constants", () => {
  it("defines bible vocabulary intro limits per JLPT level", () => {
    expect(VOCAB_INTRO_LIMITS_BY_JLPT).toEqual({
      n5: 6,
      n4: 8,
      n3: 10,
      n2: 12,
      n1: 15,
    });
    expect(getVocabIntroLimit("n5")).toBe(6);
    expect(isWithinVocabIntroLimit("n5", 6)).toBe(true);
    expect(isWithinVocabIntroLimit("n5", 7)).toBe(false);
  });

  it("defines bible review intervals including 60-day step", () => {
    expect(REVIEW_INTERVAL_DAYS).toEqual([1, 3, 7, 14, 30, 60, 90, 180, 365]);
  });
});
