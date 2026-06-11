import { kanjiRepository } from "@/features/kanji/repositories/kanji.repository";
import type {
  KanjiDetailViewModel,
  KanjiListViewModel,
} from "@/features/kanji/types/kanji.types";

class KanjiProgressService {
  async getListByJlpt(
    userId: string,
    jlptLevel: "n5" | "n4",
  ): Promise<KanjiListViewModel> {
    const [characters, learnedIds] = await Promise.all([
      kanjiRepository.listPublishedByJlpt(jlptLevel),
      kanjiRepository.listLearnedKanjiIds(userId),
    ]);

    const learnedSet = new Set(learnedIds);
    const detailed = await kanjiRepository.findByIds(characters.map((c) => c.id));
    const detailById = new Map(detailed.map((kanji) => [kanji.id, kanji]));

    const entries = characters.map((character) => {
      const detail = detailById.get(character.id);
      const onyomi =
        detail?.readings
          .filter((r) => r.reading_type === "onyomi")
          .map((r) => r.reading)
          .slice(0, 2) ?? [];
      const kunyomi =
        detail?.readings
          .filter((r) => r.reading_type === "kunyomi")
          .map((r) => r.reading)
          .slice(0, 2) ?? [];
      const readingSummary = [...onyomi, ...kunyomi].join(" · ") || null;
      const learned = learnedSet.has(character.id);

      return {
        id: character.id,
        character: character.character,
        meaning: character.meaning,
        strokeCount: character.stroke_count,
        onyomi,
        kunyomi,
        readingSummary,
        learned,
        masteryPercent: learned ? 100 : 0,
      };
    });

    const learnedCount = entries.filter((entry) => entry.learned).length;

    return {
      entries,
      learnedCount,
      totalCount: entries.length,
      progressPercent:
        entries.length === 0
          ? 0
          : Math.round((learnedCount / entries.length) * 100),
    };
  }

  async getN5List(userId: string): Promise<KanjiListViewModel> {
    return this.getListByJlpt(userId, "n5");
  }

  async getN4List(userId: string): Promise<KanjiListViewModel> {
    return this.getListByJlpt(userId, "n4");
  }

  async getKanjiDetail(
    userId: string,
    kanjiId: string,
  ): Promise<KanjiDetailViewModel | null> {
    const [kanji, learnedIds, examples] = await Promise.all([
      kanjiRepository.findById(kanjiId),
      kanjiRepository.listLearnedKanjiIds(userId),
      kanjiRepository.listPublishedExamplesByKanjiId(kanjiId),
    ]);

    if (!kanji || kanji.status !== "published") {
      return null;
    }

    return {
      id: kanji.id,
      character: kanji.character,
      meaning: kanji.meaning,
      jlptLevel: kanji.jlpt_level,
      strokeCount: kanji.stroke_count,
      onyomi: kanji.readings
        .filter((reading) => reading.reading_type === "onyomi")
        .map((reading) => reading.reading),
      kunyomi: kanji.readings
        .filter((reading) => reading.reading_type === "kunyomi")
        .map((reading) => reading.reading),
      examples: examples.map((example) => ({
        japaneseText: example.japanese_text,
        romaji: example.romaji,
        english: example.english,
      })),
      learned: learnedIds.includes(kanji.id),
    };
  }
}

export const kanjiProgressService = new KanjiProgressService();
