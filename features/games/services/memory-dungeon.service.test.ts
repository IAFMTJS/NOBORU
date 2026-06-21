import { describe, expect, it } from "vitest";

import {
  buildMemoryDungeonSession,
  canBuildMemoryDungeon,
} from "@/features/games/services/memory-dungeon.service";
import type { HiraganaRow } from "@/features/hiragana/types/hiragana.types";
import type { KanjiRow } from "@/features/kanji/types/kanji.types";
import type { VocabularyRow } from "@/features/vocabulary/types/vocabulary.types";

const vocabulary: VocabularyRow[] = Array.from({ length: 12 }, (_, index) => ({
  id: `v-${index}`,
  kana: `かな${index}`,
  kanji: index % 2 === 0 ? `漢${index}` : null,
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

const kanji: KanjiRow[] = Array.from({ length: 6 }, (_, index) => ({
  id: `k-${index}`,
  character: "山",
  meaning: `mountain ${index}`,
  jlpt_level: "n5",
  grade_level: 1,
  frequency_rank: index + 1,
  stroke_count: 3,
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

describe("memory-dungeon.service", () => {
  it("allows entry when vocabulary, kanji, or kana pools are large enough", () => {
    expect(
      canBuildMemoryDungeon({
        vocabularyCount: 4,
        kanjiCount: 0,
        hiraganaCount: 0,
        katakanaCount: 0,
      }),
    ).toBe(true);
    expect(
      canBuildMemoryDungeon({
        vocabularyCount: 0,
        kanjiCount: 4,
        hiraganaCount: 0,
        katakanaCount: 0,
      }),
    ).toBe(true);
    expect(
      canBuildMemoryDungeon({
        vocabularyCount: 0,
        kanjiCount: 0,
        hiraganaCount: 8,
        katakanaCount: 0,
      }),
    ).toBe(true);
    expect(
      canBuildMemoryDungeon({
        vocabularyCount: 2,
        kanjiCount: 2,
        hiraganaCount: 2,
        katakanaCount: 2,
      }),
    ).toBe(false);
  });

  it("builds multiple rooms when vocabulary and kanji are available", () => {
    const session = buildMemoryDungeonSession({
      vocabulary,
      kanji,
      hiragana: [],
      katakana: [],
    });

    expect(session.slug).toBe("memory-dungeon");
    expect(session.rooms.length).toBeGreaterThanOrEqual(2);
    expect(session.totalPairs).toBeGreaterThan(0);
    expect(session.roomCount).toBe(session.rooms.length);
  });

  it("builds a kana room when only kana has been learned", () => {
    const session = buildMemoryDungeonSession({
      vocabulary: [],
      kanji: [],
      hiragana,
      katakana: [],
    });

    expect(session.rooms).toHaveLength(1);
    expect(session.rooms[0]?.id).toBe("kana-cavern");
    expect(session.rooms[0]?.pairs.length).toBe(6);
  });

  it("builds a single vocabulary room when kanji is thin", () => {
    const session = buildMemoryDungeonSession({
      vocabulary: vocabulary.slice(0, 6),
      kanji: [],
      hiragana: [],
      katakana: [],
    });

    expect(session.rooms).toHaveLength(1);
    expect(session.rooms[0]?.pairs.length).toBe(6);
  });
});
