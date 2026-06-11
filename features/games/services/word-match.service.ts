import {
  GAME_SLUGS,
  KANA_MATCH_PAIR_COUNT,
  MIN_GAME_POOL_SIZE,
  WORD_MATCH_PAIR_COUNT,
} from "@/features/games/constants/game.constants";
import type { GameMode } from "@/features/games/types/game.types";
import type { HiraganaRow } from "@/features/hiragana/types/hiragana.types";
import type { KatakanaRow } from "@/features/katakana/types/katakana.types";
import type { LessonMatchingStep } from "@/features/learning/types/lesson.types";
import type { VocabularyRow } from "@/features/vocabulary/types/vocabulary.types";
import { shuffle } from "@/features/games/utils/shuffle";

function formatVocabularyPrompt(word: VocabularyRow): string {
  return word.kanji?.trim() || word.kana;
}

function buildVocabularyStep(words: VocabularyRow[]): LessonMatchingStep {
  const selected = shuffle(words).slice(0, WORD_MATCH_PAIR_COUNT);
  return {
    kind: "matching",
    prompt: "Match each Japanese word to its English meaning.",
    pairs: selected.map((word) => ({
      id: word.id,
      prompt: formatVocabularyPrompt(word),
      answer: word.meaning,
    })),
    index: 1,
    total: 1,
  };
}

function buildKanaStep(
  items: Array<HiraganaRow | KatakanaRow>,
  scriptLabel: string,
): LessonMatchingStep {
  const selected = shuffle(items).slice(0, KANA_MATCH_PAIR_COUNT);
  return {
    kind: "matching",
    prompt: `Match each ${scriptLabel} character to its romaji.`,
    pairs: selected.map((item) => ({
      id: item.id,
      prompt: item.character,
      answer: item.romaji,
    })),
    index: 1,
    total: 1,
  };
}

export function resolveWordMatchMode(
  vocabularyCount: number,
  hiraganaCount: number,
  katakanaCount: number,
): GameMode | null {
  if (vocabularyCount >= MIN_GAME_POOL_SIZE) return "vocabulary";
  if (hiraganaCount >= MIN_GAME_POOL_SIZE) return "kana";
  if (katakanaCount >= MIN_GAME_POOL_SIZE) return "kana";
  return null;
}

export function buildWordMatchSession(input: {
  mode: GameMode;
  vocabulary: VocabularyRow[];
  hiragana: HiraganaRow[];
  katakana: KatakanaRow[];
}) {
  if (input.mode === "vocabulary") {
    if (input.vocabulary.length < MIN_GAME_POOL_SIZE) {
      throw new Error("Not enough learned vocabulary for Word Match.");
    }
    return {
      slug: GAME_SLUGS.wordMatch,
      mode: "vocabulary" as const,
      modeLabel: "Word Match",
      step: buildVocabularyStep(input.vocabulary),
    };
  }

  const useHiragana = input.hiragana.length >= input.katakana.length;
  const pool = useHiragana ? input.hiragana : input.katakana;
  if (pool.length < MIN_GAME_POOL_SIZE) {
    throw new Error("Not enough learned kana for Kana Match.");
  }

  return {
    slug: GAME_SLUGS.wordMatch,
    mode: "kana" as const,
    modeLabel: useHiragana ? "Hiragana Match" : "Katakana Match",
    step: buildKanaStep(pool, useHiragana ? "hiragana" : "katakana"),
  };
}
