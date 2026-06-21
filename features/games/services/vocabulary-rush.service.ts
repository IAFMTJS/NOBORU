import {
  GAME_SLUGS,
  MIN_GAME_POOL_SIZE,
  RUSH_TIMER_MIN_SECONDS,
  RUSH_TIMER_START_SECONDS,
  RUSH_TIMER_STREAK_BONUS_SECONDS,
  VOCABULARY_RUSH_LIVES,
  VOCABULARY_RUSH_QUESTION_COUNT,
} from "@/features/games/constants/game.constants";
import type { GameMode } from "@/features/games/types/game.types";
import type { HiraganaRow } from "@/features/hiragana/types/hiragana.types";
import type { KatakanaRow } from "@/features/katakana/types/katakana.types";
import type { LessonRecallStep } from "@/features/learning/types/lesson.types";
import type { VocabularyRow } from "@/features/vocabulary/types/vocabulary.types";
import {
  kanaPoolMeetsMinimum,
  resolveKanaPool,
} from "@/features/games/utils/kana-pool";
import { shuffle } from "@/features/games/utils/shuffle";

function formatDisplay(word: VocabularyRow): string {
  if (word.kanji?.trim()) {
    return `${word.kanji} (${word.kana})`;
  }
  return word.kana;
}

function buildDistractors(
  correct: VocabularyRow,
  pool: VocabularyRow[],
): string[] {
  const samePos = pool.filter(
    (entry) =>
      entry.id !== correct.id &&
      entry.part_of_speech &&
      correct.part_of_speech &&
      entry.part_of_speech === correct.part_of_speech,
  );
  const fallback = pool.filter((entry) => entry.id !== correct.id);
  const source = samePos.length >= 3 ? samePos : fallback;
  return shuffle(source)
    .map((entry) => entry.meaning)
    .filter((meaning) => meaning !== correct.meaning)
    .slice(0, 3);
}

function buildVocabularyQuestion(
  word: VocabularyRow,
  pool: VocabularyRow[],
  index: number,
  total: number,
): LessonRecallStep {
  const correctAnswer = word.meaning;
  const distractors = buildDistractors(word, pool);
  const options = shuffle([correctAnswer, ...distractors]).slice(0, 4);
  const correctIndex = options.indexOf(correctAnswer);

  return {
    kind: "recall",
    mode: "choice",
    contentType: "vocabulary",
    prompt: "What does this word mean?",
    display: formatDisplay(word),
    options,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    lifecycleStage: "recognized",
    index,
    total,
  };
}

function buildKanaDistractors(
  correct: HiraganaRow | KatakanaRow,
  pool: Array<HiraganaRow | KatakanaRow>,
): string[] {
  return shuffle(pool)
    .filter((entry) => entry.id !== correct.id)
    .map((entry) => entry.romaji)
    .filter((romaji) => romaji !== correct.romaji)
    .slice(0, 3);
}

function buildKanaQuestion(
  item: HiraganaRow | KatakanaRow,
  pool: Array<HiraganaRow | KatakanaRow>,
  contentType: "hiragana" | "katakana",
  index: number,
  total: number,
): LessonRecallStep {
  const correctAnswer = item.romaji;
  const distractors = buildKanaDistractors(item, pool);
  const options = shuffle([correctAnswer, ...distractors]).slice(0, 4);
  const correctIndex = options.indexOf(correctAnswer);

  return {
    kind: "recall",
    mode: "choice",
    contentType,
    prompt: "What is the romaji reading?",
    display: item.character,
    options,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    lifecycleStage: "recognized",
    index,
    total,
  };
}

export function resolveVocabularyRushMode(
  vocabularyCount: number,
  hiraganaCount: number,
  katakanaCount: number,
): GameMode | null {
  if (vocabularyCount >= MIN_GAME_POOL_SIZE) return "vocabulary";
  if (kanaPoolMeetsMinimum(hiraganaCount, katakanaCount, MIN_GAME_POOL_SIZE)) {
    return "kana";
  }
  return null;
}

export function buildVocabularyRushSession(input: {
  vocabulary: VocabularyRow[];
  hiragana: HiraganaRow[];
  katakana: KatakanaRow[];
}) {
  const mode = resolveVocabularyRushMode(
    input.vocabulary.length,
    input.hiragana.length,
    input.katakana.length,
  );
  if (!mode) {
    throw new Error("Not enough learned content for Vocabulary Rush.");
  }

  if (mode === "vocabulary") {
    const selected = shuffle(input.vocabulary).slice(
      0,
      Math.min(VOCABULARY_RUSH_QUESTION_COUNT, input.vocabulary.length),
    );
    const questions = selected.map((word, index) =>
      buildVocabularyQuestion(word, input.vocabulary, index + 1, selected.length),
    );

    return {
      slug: GAME_SLUGS.vocabularyRush,
      modeLabel: "Vocabulary Rush",
      questions,
      questionCount: questions.length,
      lives: VOCABULARY_RUSH_LIVES,
      timerStartSeconds: RUSH_TIMER_START_SECONDS,
    };
  }

  const kanaPool = resolveKanaPool(input.hiragana, input.katakana);
  if (!kanaPool || kanaPool.items.length < MIN_GAME_POOL_SIZE) {
    throw new Error("Not enough learned kana for Vocabulary Rush.");
  }

  const selected = shuffle(kanaPool.items).slice(
    0,
    Math.min(VOCABULARY_RUSH_QUESTION_COUNT, kanaPool.items.length),
  );
  const questions = selected.map((item, index) =>
    buildKanaQuestion(
      item,
      kanaPool.items,
      kanaPool.script,
      index + 1,
      selected.length,
    ),
  );

  return {
    slug: GAME_SLUGS.vocabularyRush,
    modeLabel: kanaPool.script === "hiragana" ? "Hiragana Rush" : "Katakana Rush",
    questions,
    questionCount: questions.length,
    lives: VOCABULARY_RUSH_LIVES,
    timerStartSeconds: RUSH_TIMER_START_SECONDS,
  };
}

export function rushTimerForStreak(streak: number): number {
  return Math.max(
    RUSH_TIMER_MIN_SECONDS,
    RUSH_TIMER_START_SECONDS - streak * RUSH_TIMER_STREAK_BONUS_SECONDS,
  );
}
