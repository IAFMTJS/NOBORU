import type { ContentStatus } from "@/lib/content/types";
import type { ComprehensionSupportContext } from "@/lib/learning/comprehension-support.types";

export type ReadingExerciseRow = {
  id: string;
  title: string;
  japanese_text: string;
  romaji: string | null;
  english: string | null;
  question: string;
  options: string[];
  correct_option_index: number;
  difficulty: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type ReadingExerciseContent = {
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

export type StoryRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  jlpt_level: string | null;
  difficulty: number;
  estimated_read_time: number;
  status: ContentStatus;
};

export type StorySectionRow = {
  id: string;
  story_id: string;
  japanese_text: string;
  romaji: string | null;
  english: string | null;
  order_index: number;
  status: ContentStatus;
};

export type ReadingQuestionRow = {
  id: string;
  story_id: string;
  question: string;
  options: string[];
  correct_option_index: number;
  difficulty: number;
  order_index: number;
  status: ContentStatus;
};

export type DialogueScenarioRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  jlpt_level: string | null;
  difficulty: number;
  status: ContentStatus;
};

export type DialogueNodeRow = {
  id: string;
  scenario_id: string;
  speaker: string;
  japanese_text: string;
  romaji: string | null;
  english: string | null;
  node_type: "line" | "choice";
  is_entry: boolean;
  order_index: number;
};

export type DialogueChoiceRow = {
  id: string;
  node_id: string;
  choice_text: string;
  next_node_id: string | null;
  is_correct: boolean;
  order_index: number;
};

export type ReadingProgressRow = {
  id: string;
  user_id: string;
  content_type: "story" | "dialogue";
  content_id: string;
  status: "not_started" | "in_progress" | "completed";
  score: number;
  completed_at: string | null;
};

export type StoryTokenAnnotationViewModel = {
  token: string;
  isKnown: boolean;
  isMastered: boolean;
  shouldHighlight: boolean;
  vocabularyId?: string;
};

export type StorySectionViewModel = {
  id: string;
  japaneseText: string;
  romaji: string | null;
  english: string | null;
  tokenAnnotations?: StoryTokenAnnotationViewModel[];
};

export type ReadingQuestionViewModel = {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
};

export type StoryDetailViewModel = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  jlptLevel: string | null;
  estimatedReadTime: number;
  sections: StorySectionViewModel[];
  questions: ReadingQuestionViewModel[];
  highlightedVocabularyIds?: string[];
  comprehensionSupport?: ComprehensionSupportContext;
  completed: boolean;
  score: number;
};

export type StoryListEntryViewModel = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  estimatedReadTime: number;
  completed: boolean;
  score: number;
};

export type DialogueChoiceViewModel = {
  id: string;
  choiceText: string;
  nextNodeId: string | null;
  isCorrect: boolean;
};

export type DialogueNodeViewModel = {
  id: string;
  speaker: string;
  japaneseText: string;
  romaji: string | null;
  english: string | null;
  nodeType: "line" | "choice";
  isEntry: boolean;
  orderIndex: number;
  choices: DialogueChoiceViewModel[];
};

export type DialogueDetailViewModel = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  jlptLevel: string | null;
  nodes: DialogueNodeViewModel[];
  completed: boolean;
  score: number;
};

export type DialogueListEntryViewModel = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  completed: boolean;
  score: number;
};

export type ReadingHubViewModel = {
  stories: StoryListEntryViewModel[];
  dialogues: DialogueListEntryViewModel[];
  completedCount: number;
  totalCount: number;
  progressPercent: number;
};

export type StoryLessonContent = {
  type: "story";
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  sections: StorySectionViewModel[];
  questions: ReadingQuestionViewModel[];
};

export type DialogueLessonContent = {
  type: "dialogue";
  id: string;
  title: string;
  slug: string;
  description: string | null;
  nodes: DialogueNodeViewModel[];
};
