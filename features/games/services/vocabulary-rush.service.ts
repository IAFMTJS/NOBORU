import {
  GAME_SLUGS,
  MIN_GAME_POOL_SIZE,
  RUSH_TIMER_MIN_SECONDS,
  RUSH_TIMER_START_SECONDS,
  RUSH_TIMER_STREAK_BONUS_SECONDS,
  VOCABULARY_RUSH_LIVES,
  VOCABULARY_RUSH_QUESTION_COUNT,
} from "@/features/games/constants/game.constants";
import type { LessonRecallStep } from "@/features/learning/types/lesson.types";
import type { VocabularyRow } from "@/features/vocabulary/types/vocabulary.types";
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

function buildQuestion(
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

export function buildVocabularyRushSession(vocabulary: VocabularyRow[]) {
  if (vocabulary.length < MIN_GAME_POOL_SIZE) {
    throw new Error("Not enough learned vocabulary for Vocabulary Rush.");
  }

  const selected = shuffle(vocabulary).slice(
    0,
    Math.min(VOCABULARY_RUSH_QUESTION_COUNT, vocabulary.length),
  );
  const questions = selected.map((word, index) =>
    buildQuestion(word, vocabulary, index + 1, selected.length),
  );

  return {
    slug: GAME_SLUGS.vocabularyRush,
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
