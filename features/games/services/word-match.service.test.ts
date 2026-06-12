import { describe, expect, it } from "vitest";

import {
  buildWordMatchSession,
  resolveWordMatchMode,
} from "@/features/games/services/word-match.service";
import type { HiraganaRow } from "@/features/hiragana/types/hiragana.types";
import type { VocabularyRow } from "@/features/vocabulary/types/vocabulary.types";

const vocabulary: VocabularyRow[] = Array.from({ length: 6 }, (_, index) => ({
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
  romaji: "a",
  row_name: "a",
  row_label: "a-row",
  order_index: index,
  variant_type: "base",
  status: "published",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
}));

describe("word-match.service", () => {
  it("prefers vocabulary mode when enough words are learned", () => {
    expect(resolveWordMatchMode(6, 8, 0)).toBe("vocabulary");
  });

  it("falls back to kana when vocabulary is thin", () => {
    expect(resolveWordMatchMode(2, 8, 0)).toBe("kana");
  });

  it("builds a vocabulary matching session", () => {
    const session = buildWordMatchSession({
      mode: "vocabulary",
      vocabulary,
      hiragana,
      katakana: [],
    });

    expect(session.modeLabel).toBe("Word Match");
    expect(session.step.pairs).toHaveLength(6);
  });
});
