import { describe, expect, it } from "vitest";

import {
  buildVocabularyRushSession,
  rushTimerForStreak,
} from "@/features/games/services/vocabulary-rush.service";

const vocabulary = Array.from({ length: 12 }, (_, index) => ({
  id: `v-${index}`,
  kana: `かな${index}`,
  kanji: null,
  meaning: `meaning ${index}`,
  part_of_speech: "noun",
  status: "published" as const,
}));

describe("vocabulary-rush.service", () => {
  it("builds ten recall questions from learned vocabulary", () => {
    const session = buildVocabularyRushSession(vocabulary);
    expect(session.questions).toHaveLength(10);
    expect(session.questions[0]?.options).toHaveLength(4);
  });

  it("speeds up the timer as streaks grow", () => {
    expect(rushTimerForStreak(0)).toBe(12);
    expect(rushTimerForStreak(3)).toBe(9);
    expect(rushTimerForStreak(10)).toBe(6);
  });
});
