import {
  GAME_SLUGS,
  KANJI_HUNTER_LIVES,
  KANJI_HUNTER_QUESTION_COUNT,
  MIN_GAME_POOL_SIZE,
  RUSH_TIMER_MIN_SECONDS,
  RUSH_TIMER_START_SECONDS,
  RUSH_TIMER_STREAK_BONUS_SECONDS,
} from "@/features/games/constants/game.constants";
import type { LessonRecallStep } from "@/features/learning/types/lesson.types";
import type { KanjiRow } from "@/features/kanji/types/kanji.types";
import { shuffle } from "@/features/games/utils/shuffle";

function buildDistractors(correct: KanjiRow, pool: KanjiRow[]): string[] {
  return shuffle(pool)
    .filter((entry) => entry.id !== correct.id)
    .map((entry) => entry.meaning)
    .filter((meaning) => meaning !== correct.meaning)
    .slice(0, 3);
}

function buildQuestion(
  kanji: KanjiRow,
  pool: KanjiRow[],
  index: number,
  total: number,
): LessonRecallStep {
  const correctAnswer = kanji.meaning;
  const distractors = buildDistractors(kanji, pool);
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
    index,
    total,
  };
}

export function buildKanjiHunterSession(kanji: KanjiRow[]) {
  if (kanji.length < MIN_GAME_POOL_SIZE) {
    throw new Error("Not enough learned kanji for Kanji Hunter.");
  }

  const selected = shuffle(kanji).slice(
    0,
    Math.min(KANJI_HUNTER_QUESTION_COUNT, kanji.length),
  );
  const questions = selected.map((entry, index) =>
    buildQuestion(entry, kanji, index + 1, selected.length),
  );

  return {
    slug: GAME_SLUGS.kanjiHunter,
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
