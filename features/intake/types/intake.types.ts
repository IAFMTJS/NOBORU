import type { HiraganaChartEntry } from "@/features/hiragana/types/hiragana.types";
import type { KatakanaChartEntry } from "@/features/katakana/types/katakana.types";
import type {
  LessonApplicationStep,
  LessonRecallStep,
} from "@/features/learning/types/lesson.types";
import type { VocabularyListEntry } from "@/features/vocabulary/types/vocabulary.types";

export type IntakePracticeMode = "reinforce" | "grow";

export type SaveIntakeInput = {
  hiraganaIds: string[];
  katakanaIds: string[];
  vocabularyIds: string[];
};

export type IntakeResult = {
  success: boolean;
  error?: string;
  seededCount?: number;
};

export type IntakeChartData = {
  hiragana: HiraganaChartEntry[];
  katakana: KatakanaChartEntry[];
  vocabulary: VocabularyListEntry[];
};

export type IntakeDraft = {
  hiraganaIds: Set<string>;
  katakanaIds: Set<string>;
  vocabularyIds: Set<string>;
};

export type IntakePracticeStep = LessonApplicationStep | LessonRecallStep;

export type IntakePracticeSessionViewModel = {
  mode: IntakePracticeMode;
  modeLabel: string;
  steps: IntakePracticeStep[];
  knownHiraganaCount: number;
  knownKatakanaCount: number;
  knownVocabularyCount: number;
  newKanaCharacters: string[];
};

export type IntakeSummaryViewModel = {
  hiraganaCount: number;
  katakanaCount: number;
  vocabularyCount: number;
  totalKanaCount: number;
};
