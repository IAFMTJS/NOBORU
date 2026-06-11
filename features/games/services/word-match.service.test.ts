import { describe, expect, it } from "vitest";

import {
  buildWordMatchSession,
  resolveWordMatchMode,
} from "@/features/games/services/word-match.service";

const vocabulary = Array.from({ length: 6 }, (_, index) => ({
  id: `v-${index}`,
  kana: `かな${index}`,
  kanji: null,
  meaning: `meaning ${index}`,
  part_of_speech: "noun",
  status: "published" as const,
}));

const hiragana = Array.from({ length: 8 }, (_, index) => ({
  id: `h-${index}`,
  character: "あ",
  romaji: "a",
  row_label: "a-row",
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
