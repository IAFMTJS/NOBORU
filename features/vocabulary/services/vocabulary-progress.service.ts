import { vocabularyRepository } from "@/features/vocabulary/repositories/vocabulary.repository";
import type {
  VocabularyDetailViewModel,
  VocabularyExample,
  VocabularyListViewModel,
} from "@/features/vocabulary/types/vocabulary.types";

function mapExamples(
  rows: Awaited<
    ReturnType<typeof vocabularyRepository.listPublishedExamplesByVocabularyId>
  >,
): VocabularyExample[] {
  return rows.map((row) => ({
    japaneseText: row.japanese_text,
    romaji: row.romaji,
    english: row.english,
  }));
}

class VocabularyProgressService {
  async getN5List(userId: string): Promise<VocabularyListViewModel> {
    const [words, learnedIds] = await Promise.all([
      vocabularyRepository.listPublishedByJlpt("n5"),
      vocabularyRepository.listLearnedVocabularyIds(userId),
    ]);

    const learnedSet = new Set(learnedIds);
    const entries = words.map((word) => ({
      id: word.id,
      kana: word.kana,
      kanji: word.kanji,
      meaning: word.meaning,
      partOfSpeech: word.part_of_speech,
      learned: learnedSet.has(word.id),
    }));

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

  async getWordDetail(
    userId: string,
    wordId: string,
  ): Promise<VocabularyDetailViewModel | null> {
    const [word, learnedIds, examples] = await Promise.all([
      vocabularyRepository.findById(wordId),
      vocabularyRepository.listLearnedVocabularyIds(userId),
      vocabularyRepository.listPublishedExamplesByVocabularyId(wordId),
    ]);

    if (!word || word.status !== "published") {
      return null;
    }

    return {
      id: word.id,
      kana: word.kana,
      kanji: word.kanji,
      meaning: word.meaning,
      partOfSpeech: word.part_of_speech,
      jlptLevel: word.jlpt_level,
      audioUrl: word.audio_url,
      examples: mapExamples(examples),
      learned: learnedIds.includes(word.id),
    };
  }
}

export const vocabularyProgressService = new VocabularyProgressService();
