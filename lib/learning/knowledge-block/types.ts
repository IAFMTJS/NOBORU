import type { LessonContent } from "@/features/learning/types/lesson.types";
import type { PlayerKnowledgeContext } from "@/lib/learning/learning-architecture.types";

/** Nine independent learning skills from the redesign spec. */
export type LearningLayer =
  | "vocab_recognition"
  | "vocab_recall"
  | "listening"
  | "reading"
  | "sentence_comprehension"
  | "grammar"
  | "conjugation"
  | "sentence_construction"
  | "production";

export type ConceptKind =
  | "vocabulary"
  | "kanji"
  | "particle"
  | "grammar_pattern"
  | "conjugation"
  | "sentence_order"
  | "kana"
  | "combine";

export type KnowledgeBlockPhase = "teach" | "practice" | "combine" | "mastery";

export type GrammarConceptKind =
  | "particle"
  | "conjugation"
  | "pattern"
  | "sentence_order";

export type TeachingStep = {
  label: string;
  japanese: string;
  reading?: string | null;
  romaji?: string | null;
  english?: string | null;
};

export type KnowledgeConcept = {
  id: string;
  contentType: LessonContent["type"];
  contentId: string;
  conceptKind: ConceptKind;
  surface: string;
  meaning?: string | null;
  teachingSteps?: TeachingStep[];
};

export type KnowledgeBlock = {
  id: string;
  phase: KnowledgeBlockPhase;
  conceptKind: ConceptKind;
  sourceContent: LessonContent | null;
  concept: KnowledgeConcept;
  learningLayerSequence: LearningLayer[];
  allowedTestConceptIds: string[];
  orderIndex: number;
  isNew: boolean;
};

export type DecomposeLessonInput = {
  contents: LessonContent[];
  playerContext: PlayerKnowledgeContext;
  knownContentIds: ReadonlySet<string>;
};

export type BlankTarget = "word" | "particle" | "conjugation" | "grammar_element";

export const LEARNING_LAYER_LABELS: Record<LearningLayer, string> = {
  vocab_recognition: "Vocabulary recognition",
  vocab_recall: "Vocabulary recall",
  listening: "Listening",
  reading: "Reading",
  sentence_comprehension: "Sentence comprehension",
  grammar: "Grammar",
  conjugation: "Conjugation",
  sentence_construction: "Sentence construction",
  production: "Production",
};
