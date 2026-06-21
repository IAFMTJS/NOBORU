import { describe, expect, it } from "vitest";

import {
  buildVocabularyRushSession,
  resolveVocabularyRushMode,
  rushTimerForStreak,
} from "@/features/games/services/vocabulary-rush.service";
import type { HiraganaRow } from "@/features/hiragana/types/hiragana.types";
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

const hiragana: HiraganaRow[] = Array.from({ length: 8 }, (_, index) => ({
  id: `h-${index}`,
  character: "あ",
  romaji: `a${index}`,
  row_name: "a",
  row_label: "A row",
  order_index: index,
  variant_type: "base",
  status: "published",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
}));

describe("vocabulary-rush.service", () => {
  it("builds ten recall questions from learned vocabulary", () => {
    const session = buildVocabularyRushSession({
      vocabulary,
      hiragana: [],
      katakana: [],
    });
    expect(session.modeLabel).toBe("Vocabulary Rush");
    expect(session.questions).toHaveLength(10);
    expect(session.questions[0]?.options).toHaveLength(4);
  });

  it("falls back to kana rush when vocabulary is still thin", () => {
    expect(resolveVocabularyRushMode(2, 8, 0)).toBe("kana");
    const session = buildVocabularyRushSession({
      vocabulary: vocabulary.slice(0, 2),
      hiragana,
      katakana: [],
    });
    expect(session.modeLabel).toBe("Hiragana Rush");
    expect(session.questions.length).toBeGreaterThan(0);
    expect(session.questions[0]?.contentType).toBe("hiragana");
  });

  it("speeds up the timer as streaks grow", () => {
    expect(rushTimerForStreak(0)).toBe(12);
    expect(rushTimerForStreak(3)).toBe(9);
    expect(rushTimerForStreak(10)).toBe(6);
  });
});
