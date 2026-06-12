import { describe, expect, it } from "vitest";

import {
  buildMemoryDungeonSession,
  canBuildMemoryDungeon,
} from "@/features/games/services/memory-dungeon.service";
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

describe("memory-dungeon.service", () => {
  it("allows entry when vocabulary or kanji pools are large enough", () => {
    expect(canBuildMemoryDungeon(4, 0)).toBe(true);
    expect(canBuildMemoryDungeon(0, 4)).toBe(true);
    expect(canBuildMemoryDungeon(2, 2)).toBe(false);
  });

  it("builds multiple rooms when vocabulary and kanji are available", () => {
    const session = buildMemoryDungeonSession({ vocabulary, kanji });

    expect(session.slug).toBe("memory-dungeon");
    expect(session.rooms.length).toBeGreaterThanOrEqual(2);
    expect(session.totalPairs).toBeGreaterThan(0);
    expect(session.roomCount).toBe(session.rooms.length);
  });

  it("builds a single vocabulary room when kanji is thin", () => {
    const session = buildMemoryDungeonSession({
      vocabulary: vocabulary.slice(0, 6),
      kanji: [],
    });

    expect(session.rooms).toHaveLength(1);
    expect(session.rooms[0]?.pairs.length).toBe(6);
  });
});
