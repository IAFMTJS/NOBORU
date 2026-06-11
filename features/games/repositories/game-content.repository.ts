import { hiraganaRepository } from "@/features/hiragana/repositories/hiragana.repository";
import { kanjiRepository } from "@/features/kanji/repositories/kanji.repository";
import { katakanaRepository } from "@/features/katakana/repositories/katakana.repository";
import { progressRepository } from "@/features/learning/repositories/learning-path.repository";
import { reviewRepository } from "@/features/review/repositories/review.repository";
import { vocabularyRepository } from "@/features/vocabulary/repositories/vocabulary.repository";
import type { HiraganaRow } from "@/features/hiragana/types/hiragana.types";
import type { KatakanaRow } from "@/features/katakana/types/katakana.types";
import type { KanjiRow } from "@/features/kanji/types/kanji.types";
import type { VocabularyRow } from "@/features/vocabulary/types/vocabulary.types";

class GameContentRepository {
  async hasUnlockedGames(userId: string): Promise<boolean> {
    const rows = await progressRepository.listByUserId(userId);
    return rows.some((row) => row.status === "completed");
  }

  async listLearnedVocabulary(userId: string): Promise<VocabularyRow[]> {
    const ids = await vocabularyRepository.listLearnedVocabularyIds(userId);
    const rows = await vocabularyRepository.findByIds(ids);
    return rows.filter((row) => row.status === "published");
  }

  async listLearnedHiragana(userId: string): Promise<HiraganaRow[]> {
    const ids = await hiraganaRepository.listLearnedHiraganaIds(userId);
    return hiraganaRepository.findByIds(ids);
  }

  async listLearnedKatakana(userId: string): Promise<KatakanaRow[]> {
    const ids = await katakanaRepository.listLearnedKatakanaIds(userId);
    return katakanaRepository.findByIds(ids);
  }

  async listLearnedKanji(userId: string): Promise<KanjiRow[]> {
    const ids = await kanjiRepository.listLearnedKanjiIds(userId);
    return kanjiRepository.findByIds(ids);
  }

  async listWeakLearnedVocabulary(userId: string): Promise<VocabularyRow[]> {
    const weakItems = await reviewRepository.listDue(userId, 100, {
      contentType: "vocabulary",
      weakOnly: true,
    });
    const weakIds = new Set(weakItems.map((item) => item.content_id));
    const vocabulary = await this.listLearnedVocabulary(userId);
    return vocabulary.filter((row) => weakIds.has(row.id));
  }
}

export const gameContentRepository = new GameContentRepository();
