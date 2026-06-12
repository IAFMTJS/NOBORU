import { describe, expect, it } from "vitest";

import {
  buildVocabularyRushSession,
  rushTimerForStreak,
} from "@/features/games/services/vocabulary-rush.service";
import type { VocabularyRow } from "@/features/vocabulary/types/vocabulary.types";

const vocabulary: VocabularyRow[] = Array.from({ length: 12 }, (_, index) => ({
  id: `v-${index}`,
  kana: `かな${index}`,
  kanji: null,
  meaning: `meaning ${index}`,
  part_of_speech: "noun",
  jlpt_level: "n5",
  frequency_rank: index + 1,
  difficulty: 1,
  audio_url: null,
  status: "published",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
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
