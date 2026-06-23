import type { JlptLevel } from "@/lib/content/types";

import type { VocabularyLifecycleStage } from "@/lib/learning/learning-architecture.constants";

export type ContentKnowledgeId = string;

export type ActiveVocabularyPoolInput = {
  currentChapterVocabularyIds: ContentKnowledgeId[];
  previousChapterVocabularyIds: ContentKnowledgeId[];
  recentlyLearnedVocabularyIds: ContentKnowledgeId[];
  scheduledReviewVocabularyIds: ContentKnowledgeId[];
};

export type ActiveVocabularyPool = {
  vocabularyIds: ContentKnowledgeId[];
  size: number;
  bySource: {
    currentChapter: number;
    previousChapter: number;
    recentlyLearned: number;
    scheduledReview: number;
  };
};

export type GoldenContentValidationResult = {
  valid: boolean;
  unknownContentIds: ContentKnowledgeId[];
};

export type SessionMixCounts = {
  total: number;
  review: number;
  new: number;
};

export type WordMasteryStats = {
  correctAnswerCount: number;
  distinctExerciseTypes: number;
  distinctSessionCount: number;
  distinctDayCount: number;
};

export type WordMasteryEvaluation = {
  meetsBibleRequirements: boolean;
  lifecycleStage: VocabularyLifecycleStage;
  gaps: string[];
};

export type PlayerKnowledgeContext = {
  jlptLevel: JlptLevel;
  unlockedBranchIds: string[];
  unlockedChapterIds: string[];
  knownVocabularyIds: ContentKnowledgeId[];
  knownGrammarIds: ContentKnowledgeId[];
  knownKanjiIds: ContentKnowledgeId[];
  masteredVocabularyIds: ContentKnowledgeId[];
  weakVocabularyIds: ContentKnowledgeId[];
  activeVocabularyPool: ContentKnowledgeId[];
};
