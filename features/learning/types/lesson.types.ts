import type { ContentStatus } from "@/lib/content/types";
import type { ProgressStatus } from "@/features/learning/types/progress.types";
import type {
  DialogueLessonContent,
  StoryLessonContent,
} from "@/features/reading/types/reading.types";

export type LessonContentType =
  | "vocabulary"
  | "kanji"
  | "grammar"
  | "hiragana"
  | "katakana"
  | "reading"
  | "story"
  | "dialogue";

export type LessonItemRow = {
  id: string;
  lesson_id: string;
  content_type: LessonContentType;
  content_id: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type VocabularyExampleContent = {
  japaneseText: string;
  romaji: string | null;
  english: string;
};

export type VocabularyLessonContent = {
  type: "vocabulary";
  id: string;
  kana: string;
  kanji: string | null;
  meaning: string;
  partOfSpeech: string | null;
  audioUrl: string | null;
  examples: VocabularyExampleContent[];
};

export type KanjiExampleContent = {
  japaneseText: string;
  romaji: string | null;
  english: string;
};

export type KanjiLessonContent = {
  type: "kanji";
  id: string;
  character: string;
  meaning: string;
  strokeCount: number | null;
  onyomi: string[];
  kunyomi: string[];
  examples: KanjiExampleContent[];
};

export type GrammarExampleContent = {
  japaneseText: string;
  romaji: string | null;
  english: string;
};

export type GrammarLessonContent = {
  type: "grammar";
  id: string;
  title: string;
  meaning: string;
  explanation: string | null;
  examples: GrammarExampleContent[];
};

export type HiraganaLessonContent = {
  type: "hiragana";
  id: string;
  character: string;
  romaji: string;
  rowLabel: string;
};

export type KatakanaLessonContent = {
  type: "katakana";
  id: string;
  character: string;
  romaji: string;
  rowLabel: string;
};

export type ReadingLessonContent = {
  type: "reading";
  id: string;
  title: string;
  japaneseText: string;
  romaji: string | null;
  english: string | null;
  question: string;
  options: string[];
  correctOptionIndex: number;
};

export type LessonContent =
  | VocabularyLessonContent
  | KanjiLessonContent
  | GrammarLessonContent
  | HiraganaLessonContent
  | KatakanaLessonContent
  | ReadingLessonContent
  | StoryLessonContent
  | DialogueLessonContent;

export type LessonIntroStep = {
  kind: "intro";
  title: string;
  description: string | null;
  lessonType: string;
  xpReward: number;
};

export type LessonTeachStep = {
  kind: "teach";
  content: LessonContent;
  index: number;
  total: number;
};

export type LessonRecallStep = {
  kind: "recall";
  contentType: LessonContentType;
  prompt: string;
  display: string;
  options: string[];
  correctIndex: number;
  index: number;
  total: number;
};

export type LessonReadingStep = {
  kind: "reading";
  content: ReadingLessonContent;
  index: number;
  total: number;
};

export type LessonStoryStep = {
  kind: "story";
  content: StoryLessonContent;
};

export type LessonDialogueStep = {
  kind: "dialogue";
  content: DialogueLessonContent;
};

export type LessonCompleteStep = {
  kind: "complete";
  xpReward: number;
};

export type LessonStep =
  | LessonIntroStep
  | LessonTeachStep
  | LessonRecallStep
  | LessonReadingStep
  | LessonStoryStep
  | LessonDialogueStep
  | LessonCompleteStep;

export type LessonSessionViewModel = {
  lessonId: string;
  unitId: string;
  regionSlug: string;
  title: string;
  description: string | null;
  type: string;
  xpReward: number;
  status: ContentStatus;
  progress: ProgressStatus;
  score: number;
  steps: LessonStep[];
};

export type LessonSummaryViewModel = {
  id: string;
  unitId: string;
  type: string;
  title: string;
  description: string | null;
  xpReward: number;
  estimatedDuration: number | null;
  progress: ProgressStatus;
  score: number;
};

export type UnitSummaryViewModel = {
  id: string;
  name: string;
  description: string | null;
  orderIndex: number;
  lessonCount: number;
  completedCount: number;
  lessons: LessonSummaryViewModel[];
};

export type RegionPathViewModel = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  lessonCount: number;
  completedCount: number;
  progressPercent: number;
  units: UnitSummaryViewModel[];
};

export type LearningPathViewModel = {
  regions: RegionPathViewModel[];
  nextLesson: LessonSummaryViewModel | null;
  nextLessonHref: string | null;
};
