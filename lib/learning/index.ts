export {
  CHECKPOINT_MINI_CHAPTERS_MAX,
  CHECKPOINT_MINI_CHAPTERS_MIN,
  getVocabIntroLimit,
  isWithinVocabIntroLimit,
  LEARNING_ARCHITECTURE_VERSION,
  LEARNING_FLOW_STAGES,
  MASTERY_MIN_CORRECT_ANSWERS,
  MASTERY_MIN_DISTINCT_DAYS,
  MASTERY_MIN_EXERCISE_TYPES,
  MASTERY_MIN_SESSIONS,
  NEW_CONTENT_RATIO,
  REVIEW_CONTENT_RATIO,
  REVIEW_INTERVAL_DAYS,
  VOCAB_INTRO_LIMITS_BY_JLPT,
  VOCABULARY_LIFECYCLE_STAGES,
  WORLD_TREE_CMS_ALIASES,
  WORLD_TREE_NODE_TYPES,
  type LearningFlowStage,
  type ReviewIntervalDays,
  type VocabularyLifecycleStage,
  type WorldTreeNodeType,
} from "@/lib/learning/learning-architecture.constants";

export {
  LESSON_MAX_CONSECUTIVE_SAME_KIND,
  LESSON_MAX_SCORED_EXERCISES,
  LESSON_MIN_SCORED_EXERCISES,
  LESSON_PASS_SCORE_UNIVERSAL,
  LESSON_STAGES,
  LESSON_TARGET_DURATION_MAX,
  LESSON_TARGET_DURATION_MIN,
  STAGE_EXERCISE_RANGES,
  STAGE_LABELS,
  type LessonStage,
  type ScoredLessonStage,
} from "@/lib/learning/lesson-stage.constants";

export {
  LESSON_PHASES,
  PHASE_LABELS,
  SPIRAL_MAX_EXPOSURES_PER_CONCEPT,
  SPIRAL_MIN_EXPOSURES_PER_CONCEPT,
  STAGE_TO_PHASE,
  resolvePhaseFromStage,
  shouldDisableDrillHints,
  type LessonPhase,
} from "@/lib/learning/lesson-phase.constants";

export {
  getContentIdFromStep,
  resolveStepPhase,
  summarizeLessonPhases,
} from "@/lib/learning/lesson-phase.utils";

export {
  buildFinalRemediationBatch,
  buildRemediationStep,
  getUnresolvedFailureIds,
  insertRemediationStep,
  type LessonFailureRecord,
} from "@/lib/learning/lesson-remediation.service";

export {
  assembleStagedExerciseSteps,
  computeStagePlans,
  enforceExerciseVariety,
  hasListeningAudio,
  summarizeLessonStages,
  type StagedLessonAssemblyInput,
} from "@/lib/learning/lesson-stage-assembly.service";

export type {
  ActiveVocabularyPool,
  ActiveVocabularyPoolInput,
  ContentKnowledgeId,
  GoldenContentValidationResult,
  PlayerKnowledgeContext,
  SessionMixCounts,
  WordMasteryEvaluation,
  WordMasteryStats,
} from "@/lib/learning/learning-architecture.types";

export {
  buildActiveVocabularyPool,
  isInActiveVocabularyPool,
} from "@/lib/learning/active-vocabulary-pool.service";

export {
  assertGoldenContentRule,
  validateGoldenContentRule,
} from "@/lib/learning/golden-content.validator";

export {
  computeSessionMixCounts,
  mixSessionItems,
  type SessionMixItem,
} from "@/lib/learning/session-mixer.service";

export {
  computeLessonExerciseSlotCount,
  capNewVocabularyInLessonContents,
  buildCheckpointExerciseCandidates,
  extractExerciseContents,
  partitionLessonContentsByKnown,
  planLessonExerciseCandidates,
  type LessonExerciseCandidate,
} from "@/lib/learning/lesson-assembly.service";

export {
  getKnownIdsFromSnapshot,
  getMasteredIdsFromSnapshot,
  getScheduledReviewIdsFromSnapshot,
  getWeakIdsFromSnapshot,
  prioritizeReviewContentIds,
  type LearnedContentSnapshot,
  type ReviewItemSnapshot,
} from "@/lib/learning/player-knowledge.utils";

export {
  evaluateWordMastery,
  mapReviewStateToLifecycleStage,
} from "@/lib/learning/vocabulary-lifecycle";

export {
  LEARNING_CORE_PRINCIPLES,
  RETENTION_DESIGN_QUESTION,
  type LearningCorePrinciple,
} from "@/lib/learning/core-principles.constants";

export {
  isRetentionFlowStage,
  resolveFlowStageForStepKind,
} from "@/lib/learning/learning-flow.service";

export {
  GRAMMAR_INTRO_LIMITS_BY_JLPT,
  capNewGrammarInLessonContents,
  filterGrammarIdsToKnown,
  getGrammarIntroLimit,
  isWithinGrammarIntroLimit,
} from "@/lib/learning/grammar-progression.service";

export {
  clampSentenceToProfile,
  resolveDifficultyProfile,
  type DifficultyProfile,
} from "@/lib/learning/difficulty-scaling.service";

export {
  applyDifficultyToChoiceOptions,
  recognitionTimerSeconds,
  resolveFuriganaReading,
  shouldAutoFailOnRecognitionTimeout,
  shouldShowDrillHints,
} from "@/lib/learning/drill-difficulty.utils";

export {
  buildLearningBranchSlug,
  resolveThematicCategorySlugForUnitName,
} from "@/lib/learning/world-tree-branch.utils";

export {
  buildFailureFeedback,
  type FailureFeedbackInput,
  type FailureFeedbackViewModel,
} from "@/lib/learning/failure-feedback.service";

export {
  reinforcementTargetIds,
  selectReinforcementTargets,
  type ReinforcementTarget,
} from "@/lib/learning/reinforcement.service";

export {
  assertContentEligibility,
  evaluateContentEligibility,
  type ContentEligibilityResult,
} from "@/lib/learning/content-eligibility.service";

export {
  annotateJapaneseSentence,
  sentenceHasUnknownTokens,
} from "@/lib/learning/sentence-annotation.service";

export type {
  AnnotateSentenceOptions,
  ComprehensionSupportContext,
  ComprehensionSupportMode,
  KanjiLookupEntry,
  SentenceSegment,
  SentenceTokenAnnotation,
  VocabularyLookupEntry,
} from "@/lib/learning/comprehension-support.types";

export {
  assembleStoryForPlayer,
  type AssembledStorySection,
  type StoryAssemblyResult,
  type StoryTokenAnnotation,
} from "@/lib/learning/story-assembly.service";

export {
  CHECKPOINT_ACTIVITY_TYPES,
  checkpointCadenceLabel,
  planCheckpointActivities,
  shouldInsertCheckpointAfterMiniChapter,
  type CheckpointActivityPlan,
  type CheckpointActivityType,
} from "@/lib/learning/checkpoint-assembly.service";

export {
  BOSS_EXAM_ACTIVITY_TYPES,
  bossExamIsProgressionGate,
  planBossExamination,
  type BossExamActivityType,
  type BossExamStepPlan,
} from "@/lib/learning/boss-examination.service";

export {
  DAILY_CHALLENGE_PRIORITIES,
  buildDailyChallengeSession,
  type DailyChallengeItem,
  type DailyChallengePriority,
  type DailyChallengeSession,
} from "@/lib/learning/daily-challenge.service";

export {
  LANGUAGE_QUEST_OBJECTIVE_TYPES,
  buildLanguageQuestObjectives,
  type LanguageQuestObjective,
  type LanguageQuestObjectiveType,
} from "@/lib/learning/quest-assembly.service";

export {
  buildCompanionDialogueLine,
  selectCompanionVocabularySnippets,
  type CompanionVocabularySnippet,
} from "@/lib/learning/companion-dialogue.service";
