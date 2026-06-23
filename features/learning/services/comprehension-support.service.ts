import type { JlptLevel } from "@/lib/content/types";
import type {
  ComprehensionSupportContext,
  KanjiLookupEntry,
  VocabularyLookupEntry,
} from "@/lib/learning/comprehension-support.types";
import type { PlayerKnowledgeContext } from "@/lib/learning/learning-architecture.types";
import { kanjiRepository } from "@/features/kanji/repositories/kanji.repository";
import { vocabularyRepository } from "@/features/vocabulary/repositories/vocabulary.repository";

function buildVocabularyLookupEntry(row: {
  id: string;
  kana: string;
  kanji: string | null;
  meaning: string;
}): VocabularyLookupEntry {
  const surfaceForms = [row.kana, row.kanji].filter(
    (value): value is string => Boolean(value),
  );

  return {
    id: row.id,
    kana: row.kana,
    kanji: row.kanji,
    meaning: row.meaning,
    surfaceForms,
  };
}

class ComprehensionSupportService {
  async buildForPlayer(
    playerContext: PlayerKnowledgeContext,
    jlptLevel: JlptLevel,
  ): Promise<ComprehensionSupportContext> {
    const [vocabularyRows, kanjiRows] = await Promise.all([
      vocabularyRepository.listPublishedByJlpt(jlptLevel),
      kanjiRepository.listPublishedByJlpt(jlptLevel),
    ]);

    const kanjiWithReadings = await kanjiRepository.findByIds(
      kanjiRows.map((row) => row.id),
    );

    const vocabularyById: Record<string, VocabularyLookupEntry> = {};
    for (const row of vocabularyRows) {
      vocabularyById[row.id] = buildVocabularyLookupEntry(row);
    }

    const kanjiByCharacter: Record<string, KanjiLookupEntry> = {};
    for (const row of kanjiWithReadings) {
      kanjiByCharacter[row.character] = {
        id: row.id,
        character: row.character,
        meaning: row.meaning,
        onyomi: row.readings
          .filter((reading) => reading.reading_type === "onyomi")
          .map((reading) => reading.reading),
        kunyomi: row.readings
          .filter((reading) => reading.reading_type === "kunyomi")
          .map((reading) => reading.reading),
      };
    }

    return {
      knownVocabularyIds: playerContext.knownVocabularyIds,
      knownKanjiIds: playerContext.knownKanjiIds,
      activeVocabularyPool: playerContext.activeVocabularyPool,
      masteredVocabularyIds: playerContext.masteredVocabularyIds,
      vocabularyById,
      kanjiByCharacter,
    };
  }
}

export const comprehensionSupportService = new ComprehensionSupportService();
