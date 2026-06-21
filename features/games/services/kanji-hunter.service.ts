import {
  GAME_SLUGS,
  KANJI_HUNTER_LIVES,
  KANJI_HUNTER_QUESTION_COUNT,
  MIN_GAME_POOL_SIZE,
  RUSH_TIMER_MIN_SECONDS,
  RUSH_TIMER_START_SECONDS,
  RUSH_TIMER_STREAK_BONUS_SECONDS,
} from "@/features/games/constants/game.constants";
import type { GameMode } from "@/features/games/types/game.types";
import type { HiraganaRow } from "@/features/hiragana/types/hiragana.types";
import type { KatakanaRow } from "@/features/katakana/types/katakana.types";
import type { LessonRecallStep } from "@/features/learning/types/lesson.types";
import type { KanjiRow } from "@/features/kanji/types/kanji.types";
import {
  kanaPoolMeetsMinimum,
  resolveKanaPool,
} from "@/features/games/utils/kana-pool";
import { shuffle } from "@/features/games/utils/shuffle";

function buildKanjiDistractors(correct: KanjiRow, pool: KanjiRow[]): string[] {
  return shuffle(pool)
    .filter((entry) => entry.id !== correct.id)
    .map((entry) => entry.meaning)
    .filter((meaning) => meaning !== correct.meaning)
    .slice(0, 3);
}

function buildKanjiQuestion(
  kanji: KanjiRow,
  pool: KanjiRow[],
  index: number,
  total: number,
): LessonRecallStep {
  const correctAnswer = kanji.meaning;
  const distractors = buildKanjiDistractors(kanji, pool);
  const options = shuffle([correctAnswer, ...distractors]).slice(0, 4);
  const correctIndex = options.indexOf(correctAnswer);

  return {
    kind: "recall",
    mode: "choice",
    contentType: "kanji",
    prompt: "What does this kanji mean?",
    display: kanji.character,
    options,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    lifecycleStage: "applied",
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

export function resolveKanjiHunterMode(
  kanjiCount: number,
  hiraganaCount: number,
  katakanaCount: number,
): GameMode | null {
  if (kanjiCount >= MIN_GAME_POOL_SIZE) return "vocabulary";
  if (kanaPoolMeetsMinimum(hiraganaCount, katakanaCount, MIN_GAME_POOL_SIZE)) {
    return "kana";
  }
  return null;
}

export function buildKanjiHunterSession(input: {
  kanji: KanjiRow[];
  hiragana: HiraganaRow[];
  katakana: KatakanaRow[];
}) {
  const mode = resolveKanjiHunterMode(
    input.kanji.length,
    input.hiragana.length,
    input.katakana.length,
  );
  if (!mode) {
    throw new Error("Not enough learned content for Kanji Hunter.");
  }

  if (mode === "vocabulary") {
    const selected = shuffle(input.kanji).slice(
      0,
      Math.min(KANJI_HUNTER_QUESTION_COUNT, input.kanji.length),
    );
    const questions = selected.map((entry, index) =>
      buildKanjiQuestion(entry, input.kanji, index + 1, selected.length),
    );

    return {
      slug: GAME_SLUGS.kanjiHunter,
      modeLabel: "Kanji Hunter",
      questions,
      questionCount: questions.length,
      lives: KANJI_HUNTER_LIVES,
      timerStartSeconds: RUSH_TIMER_START_SECONDS,
    };
  }

  const kanaPool = resolveKanaPool(input.hiragana, input.katakana);
  if (!kanaPool || kanaPool.items.length < MIN_GAME_POOL_SIZE) {
    throw new Error("Not enough learned kana for Kanji Hunter.");
  }

  const selected = shuffle(kanaPool.items).slice(
    0,
    Math.min(KANJI_HUNTER_QUESTION_COUNT, kanaPool.items.length),
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
    slug: GAME_SLUGS.kanjiHunter,
    modeLabel: kanaPool.script === "hiragana" ? "Hiragana Hunter" : "Katakana Hunter",
    questions,
    questionCount: questions.length,
    lives: KANJI_HUNTER_LIVES,
    timerStartSeconds: RUSH_TIMER_START_SECONDS,
  };
}

export function kanjiHunterTimerForStreak(streak: number): number {
  return Math.max(
    RUSH_TIMER_MIN_SECONDS,
    RUSH_TIMER_START_SECONDS - streak * RUSH_TIMER_STREAK_BONUS_SECONDS,
  );
}
