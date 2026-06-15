import type { ContentStatus } from "@/lib/content/types";
import type { ProgressStatus } from "@/features/learning/types/progress.types";
import type { RegionAvailability } from "@/lib/learning/region-unlock";
import type {
  DialogueLessonContent,
  StoryLessonContent,
} from "@/features/reading/types/reading.types";
import type { ApplicationLessonContent } from "@/features/application/types/application.types";
import type {
  ListeningChallengeLessonContent,
  ListeningLessonContent,
} from "@/features/listening/types/listening.types";

export type LessonContentType =
  | "vocabulary"
  | "kanji"
  | "grammar"
  | "hiragana"
  | "katakana"
  | "reading"
  | "story"
  | "dialogue"
  | "listening"
  | "listening_challenge"
  | "application";

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
  | DialogueLessonContent
  | ListeningLessonContent
  | ListeningChallengeLessonContent
  | ApplicationLessonContent;

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

export type LessonRecallMode = "choice" | "typed";

export type LessonRecallPhase = "standard" | "consolidation";

export type LessonRecallStep = {
  kind: "recall";
  mode: LessonRecallMode;
  contentType: LessonContentType;
  prompt: string;
  display: string;
  options: string[];
  correctIndex: number;
  acceptedAnswers?: string[];
  phase?: LessonRecallPhase;
  index: number;
  total: number;
};

export type LessonFillBlankStep = {
  kind: "fill_blank";
  prompt: string;
  sentenceWithBlank: string;
  englishHint: string;
  options: string[];
  correctIndex: number;
  index: number;
  total: number;
};

export type LessonWordBankStep = {
  kind: "word_bank";
  prompt: string;
  englishHint: string;
  tokens: string[];
  correctOrder: string[];
  index: number;
  total: number;
};

export type LessonSentenceTypedStep = {
  kind: "sentence_typed";
  prompt: string;
  englishHint: string;
  acceptedAnswers: string[];
  index: number;
  total: number;
};

export type LessonMatchingPair = {
  id: string;
  prompt: string;
  answer: string;
};

export type LessonMatchingStep = {
  kind: "matching";
  prompt: string;
  pairs: LessonMatchingPair[];
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

export type LessonListeningStep = {
  kind: "listening";
  content: ListeningLessonContent;
};

export type LessonListeningChallengeStep = {
  kind: "listening_challenge";
  content: ListeningChallengeLessonContent;
};

export type ApplicationDirection = "to_japanese" | "to_english" | "to_romaji";

export type LessonApplicationStep = {
  kind: "application";
  direction: ApplicationDirection;
  prompt: string;
  display: string;
  displayHint: string | null;
  acceptedAnswers: string[];
  index: number;
  total: number;
};

export type LessonKnowledgeInventoryStep = {
  kind: "knowledge_inventory";
  script: "hiragana" | "katakana";
  learnedCount: number;
  totalCount: number;
  learnedCharacters: Array<{ character: string; romaji: string }>;
};

export type LessonCompleteStep = {
  kind: "complete";
  xpReward: number;
};

export type LessonStep =
  | LessonIntroStep
  | LessonTeachStep
  | LessonRecallStep
  | LessonFillBlankStep
  | LessonWordBankStep
  | LessonSentenceTypedStep
  | LessonMatchingStep
  | LessonReadingStep
  | LessonStoryStep
  | LessonDialogueStep
  | LessonListeningStep
  | LessonListeningChallengeStep
  | LessonApplicationStep
  | LessonKnowledgeInventoryStep
  | LessonCompleteStep;

export type LessonSessionViewModel = {
  lessonId: string;
  /** Journey trail node id — matches lesson id for lesson nodes. */
  trailNodeId: string;
  unitId: string;
  regionSlug: string;
  title: string;
  description: string | null;
  type: string;
  xpReward: number;
  status: ContentStatus;
  progress: ProgressStatus;
  score: number;
  passScore: number;
  steps: LessonStep[];
  nextLesson: {
    title: string;
    href: string;
  } | null;
  /** Region slug revealed when this lesson completes the current region. */
  unlocksRegionSlug?: string | null;
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
  availability: RegionAvailability;
  lockReason: string | null;
  units: UnitSummaryViewModel[];
};

export type LearningPathViewModel = {
  regions: RegionPathViewModel[];
  nextLesson: LessonSummaryViewModel | null;
  nextLessonHref: string | null;
};
