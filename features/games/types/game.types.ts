import { GAME_SLUGS, type GameSlug } from "@/features/games/constants/game.constants";
import type { LessonMatchingStep, LessonRecallStep } from "@/features/learning/types/lesson.types";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";
import type { QuestCompletionViewModel } from "@/features/quests/types/quest.types";

export type GameMode = "vocabulary" | "kana";

export type WordMatchSessionViewModel = {
  slug: typeof GAME_SLUGS.wordMatch;
  mode: GameMode;
  modeLabel: string;
  step: LessonMatchingStep;
};

export type VocabularyRushSessionViewModel = {
  slug: typeof GAME_SLUGS.vocabularyRush;
  questions: LessonRecallStep[];
  questionCount: number;
  lives: number;
  timerStartSeconds: number;
};

export type KanjiHunterSessionViewModel = {
  slug: typeof GAME_SLUGS.kanjiHunter;
  questions: LessonRecallStep[];
  questionCount: number;
  lives: number;
  timerStartSeconds: number;
};

export type GameSessionViewModel =
  | WordMatchSessionViewModel
  | VocabularyRushSessionViewModel
  | KanjiHunterSessionViewModel;

export type GameCompleteInput = {
  correctCount: number;
  totalCount: number;
  wrongAttempts?: number;
  durationMs?: number;
};

export type GameCompleteViewModel = {
  slug: GameSlug;
  accuracyPercent: number;
  epAwarded: number;
  elevation: ElevationAwardViewModel | null;
  quests: QuestCompletionViewModel[];
};

export type GameAvailabilityViewModel = {
  wordMatch: { available: boolean; mode: GameMode | null; poolSize: number };
  vocabularyRush: { available: boolean; poolSize: number };
  kanjiHunter: { available: boolean; poolSize: number };
};
