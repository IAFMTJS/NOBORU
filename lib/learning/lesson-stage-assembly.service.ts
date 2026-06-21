import type {
  LessonContent,
  LessonPhaseSummary,
  LessonRecallStep,
  LessonStageSummary,
  LessonStep,
  ScoredLessonStep,
  VocabularyLessonContent,
} from "@/features/learning/types/lesson.types";
import {
  buildActiveRecallStep,
  buildFillBlankStep,
  buildListeningRecallStep,
  buildMasteryChallengeStep,
  buildMatchingStep,
  buildRecognitionChoiceStep,
  buildReverseRecognitionStep,
  buildSentenceTypedStep,
  buildVarietyStep,
  buildWordBankStep,
  getJapaneseSurface,
  getRecallAnswer,
  shuffle,
} from "@/features/learning/utils/exercise-steps";
import {
  LESSON_MAX_CONSECUTIVE_SAME_KIND,
  LESSON_MAX_SCORED_EXERCISES,
  LESSON_MIN_SCORED_EXERCISES,
  LESSON_REVIEW_RATIO_MIN,
  LESSON_STAGES,
  STAGE_EXERCISE_RANGES,
  STAGE_LABELS,
  type LessonStage,
  type ScoredLessonStage,
} from "@/lib/learning/lesson-stage.constants";
import {
  PHASE_LABELS,
  SPIRAL_MAX_EXPOSURES_PER_CONCEPT,
  SPIRAL_MIN_EXPOSURES_PER_CONCEPT,
  type LessonPhase,
} from "@/lib/learning/lesson-phase.constants";
import { summarizeLessonPhases } from "@/lib/learning/lesson-phase.utils";

export type StagedLessonAssemblyInput = {
  newContents: LessonContent[];
  reviewContents: LessonContent[];
  isCheckpoint: boolean;
};

type StagePlan = {
  stage: ScoredLessonStage;
  count: number;
};

type ConceptExposurePlan = {
  content: LessonContent;
  stage: ScoredLessonStage;
  lessonPhase: LessonPhase;
  build: () => ScoredLessonStep | null;
};

function isDrillContent(
  content: LessonContent,
): content is Exclude<
  LessonContent,
  { type: "reading" | "story" | "dialogue" | "listening" | "listening_challenge" | "application" }
> {
  return (
    content.type === "vocabulary" ||
    content.type === "kanji" ||
    content.type === "grammar" ||
    content.type === "hiragana" ||
    content.type === "katakana"
  );
}

function getStepKind(step: ScoredLessonStep): string {
  return step.kind;
}

/** Never show the same exercise type more than twice consecutively. */
export function enforceExerciseVariety(steps: ScoredLessonStep[]): ScoredLessonStep[] {
  if (steps.length <= LESSON_MAX_CONSECUTIVE_SAME_KIND + 1) return steps;

  const result = [...steps];

  for (let index = LESSON_MAX_CONSECUTIVE_SAME_KIND; index < result.length; index += 1) {
    const kind = getStepKind(result[index]!);
    let consecutive = 1;
    for (let back = index - 1; back >= 0; back -= 1) {
      if (getStepKind(result[back]!) !== kind) break;
      consecutive += 1;
    }

    if (consecutive <= LESSON_MAX_CONSECUTIVE_SAME_KIND) continue;

    const swapIndex = result.findIndex(
      (step, candidateIndex) =>
        candidateIndex > index && getStepKind(step) !== kind,
    );
    if (swapIndex === -1) continue;

    const temp = result[index]!;
    result[index] = result[swapIndex]!;
    result[swapIndex] = temp;
  }

  return result;
}

function clampStageCount(stage: ScoredLessonStage, requested: number): number {
  const range = STAGE_EXERCISE_RANGES[stage];
  return Math.max(range.min, Math.min(range.max, requested));
}

export function computeStagePlans(
  newConceptCount: number,
  isCheckpoint: boolean,
): StagePlan[] {
  const conceptScale = Math.max(1, Math.min(3, newConceptCount || 1));

  if (isCheckpoint) {
    return [
      { stage: "recognition", count: 3 },
      { stage: "guided_practice", count: 2 },
      { stage: "active_recall", count: 2 },
      { stage: "listening", count: 1 },
      { stage: "context_application", count: 2 },
      { stage: "review_injection", count: 3 },
      { stage: "mastery_challenge", count: 1 },
    ];
  }

  const recognition = clampStageCount("recognition", conceptScale + 1);
  const guided = clampStageCount("guided_practice", conceptScale + 1);
  const recall = clampStageCount("active_recall", conceptScale);
  const listening = clampStageCount("listening", 1);
  const context = clampStageCount("context_application", conceptScale + 1);
  const review = clampStageCount("review_injection", Math.max(2, conceptScale));
  const mastery = 1;

  let total =
    recognition + guided + recall + listening + context + review + mastery;

  if (total > LESSON_MAX_SCORED_EXERCISES) {
    const overflow = total - LESSON_MAX_SCORED_EXERCISES;
    const trimmedReview = Math.max(STAGE_EXERCISE_RANGES.review_injection.min, review - overflow);
    total = total - review + trimmedReview;
    return [
      { stage: "recognition", count: recognition },
      { stage: "guided_practice", count: guided },
      { stage: "active_recall", count: recall },
      { stage: "listening", count: listening },
      { stage: "context_application", count: context },
      { stage: "review_injection", count: trimmedReview },
      { stage: "mastery_challenge", count: mastery },
    ];
  }

  if (total < LESSON_MIN_SCORED_EXERCISES) {
    const deficit = LESSON_MIN_SCORED_EXERCISES - total;
    return [
      { stage: "recognition", count: recognition + Math.ceil(deficit / 2) },
      { stage: "guided_practice", count: guided },
      { stage: "active_recall", count: recall },
      { stage: "listening", count: listening },
      { stage: "context_application", count: context + Math.floor(deficit / 2) },
      { stage: "review_injection", count: review },
      { stage: "mastery_challenge", count: mastery },
    ];
  }

  return [
    { stage: "recognition", count: recognition },
    { stage: "guided_practice", count: guided },
    { stage: "active_recall", count: recall },
    { stage: "listening", count: listening },
    { stage: "context_application", count: context },
    { stage: "review_injection", count: review },
    { stage: "mastery_challenge", count: mastery },
  ];
}

function buildConceptExposurePlans(
  content: LessonContent,
  allAnswers: string[],
  allSurfaces: string[],
): ConceptExposurePlan[] {
  if (!isDrillContent(content)) return [];

  const plans: ConceptExposurePlan[] = [
    {
      content,
      stage: "recognition",
      lessonPhase: "introduction",
      build: () => buildRecognitionChoiceStep(content, allAnswers, 0, 0, "recognition"),
    },
    {
      content,
      stage: "recognition",
      lessonPhase: "recognition",
      build: () => buildReverseRecognitionStep(content, allSurfaces, 0, 0, "recognition"),
    },
    {
      content,
      stage: "guided_practice",
      lessonPhase: "recognition",
      build: () => {
        if (content.type === "vocabulary" && content.audioUrl) {
          return buildListeningRecallStep(content, allAnswers, 0, 0, "listening");
        }
        if (content.type === "grammar" || content.type === "vocabulary") {
          const fillBlank = buildFillBlankStep(content, allAnswers, 0, 0);
          if (fillBlank) return { ...fillBlank, stage: "guided_practice" as const };
        }
        return buildVarietyStep(content, allAnswers, 1, 0, 0);
      },
    },
    {
      content,
      stage: "active_recall",
      lessonPhase: "active_recall",
      build: () => buildActiveRecallStep(content, allAnswers, 0, 0, "active_recall"),
    },
    {
      content,
      stage: "context_application",
      lessonPhase: "context_mastery",
      build: () => {
        if (content.type === "grammar" || content.type === "vocabulary") {
          const sentence = buildSentenceTypedStep(content, 0, 0);
          if (sentence) {
            return {
              ...sentence,
              stage: "context_application" as const,
              prompt: "Translate into Japanese",
            };
          }
          const wordBank = buildWordBankStep(content, 0, 0);
          if (wordBank) {
            return {
              ...wordBank,
              stage: "context_application" as const,
              prompt: "Build the sentence",
            };
          }
        }
        return buildActiveRecallStep(content, allAnswers, 0, 0, "context_application");
      },
    },
    {
      content,
      stage: "mastery_challenge",
      lessonPhase: "context_mastery",
      build: () => buildMasteryChallengeStep(content, allAnswers, 0, 0),
    },
  ];

  return plans.slice(0, SPIRAL_MAX_EXPOSURES_PER_CONCEPT);
}

function interleaveSpiralExposures(
  concepts: LessonContent[],
  allAnswers: string[],
  allSurfaces: string[],
): ScoredLessonStep[] {
  const plansByConcept = concepts.map((content) =>
    buildConceptExposurePlans(content, allAnswers, allSurfaces),
  );

  const maxDepth = Math.max(
    SPIRAL_MIN_EXPOSURES_PER_CONCEPT,
    ...plansByConcept.map((plans) => plans.length),
  );

  const rawSteps: ScoredLessonStep[] = [];

  for (let depth = 0; depth < maxDepth; depth += 1) {
    for (const plans of plansByConcept) {
      const plan = plans[depth];
      if (!plan) continue;
      const step = plan.build();
      if (!step) continue;
      rawSteps.push({
        ...step,
        stage: plan.stage,
        lessonPhase: plan.lessonPhase,
      } as ScoredLessonStep);
    }
  }

  return rawSteps;
}

function buildReviewInjectionSteps(
  reviewContents: LessonContent[],
  allAnswers: string[],
  count: number,
  startIndex: number,
  total: number,
): ScoredLessonStep[] {
  const pool = shuffle(reviewContents.filter(isDrillContent));
  if (pool.length === 0 || count <= 0) return [];

  const steps: ScoredLessonStep[] = [];

  for (let index = 0; index < count; index += 1) {
    const content = pool[index % pool.length]!;
    const variety = buildVarietyStep(content, allAnswers, index + 3, startIndex + index + 1, total);
    if (variety) {
      steps.push({
        ...variety,
        stage: "review_injection",
        lessonPhase: "context_mastery",
      } as ScoredLessonStep);
      continue;
    }
    const recall = buildActiveRecallStep(
      content,
      allAnswers,
      startIndex + index + 1,
      total,
      "review_injection",
    );
    if (recall) steps.push(recall);
  }

  return steps;
}

function buildCheckpointSteps(
  reviewContents: LessonContent[],
  allAnswers: string[],
  allSurfaces: string[],
): ScoredLessonStep[] {
  const stagePlans = computeStagePlans(0, true);
  const total = stagePlans.reduce((sum, plan) => sum + plan.count, 0);
  const pool = shuffle(reviewContents.filter(isDrillContent));
  const rawSteps: ScoredLessonStep[] = [];
  let runningIndex = 0;

  for (const plan of stagePlans) {
    for (let index = 0; index < plan.count; index += 1) {
      const content = pool[(runningIndex + index) % Math.max(pool.length, 1)];
      if (!content) continue;

      let step: ScoredLessonStep | null = null;

      if (plan.stage === "recognition") {
        step =
          index % 2 === 0
            ? buildRecognitionChoiceStep(
                content,
                allAnswers,
                runningIndex + index + 1,
                total,
                plan.stage,
              )
            : buildReverseRecognitionStep(
                content,
                allSurfaces,
                runningIndex + index + 1,
                total,
                plan.stage,
              );
      } else if (plan.stage === "guided_practice") {
        const variety = buildVarietyStep(content, allAnswers, index, runningIndex + index + 1, total);
        step = variety ? ({ ...variety, stage: plan.stage } as ScoredLessonStep) : null;
      } else if (plan.stage === "active_recall") {
        step = buildActiveRecallStep(content, allAnswers, runningIndex + index + 1, total, plan.stage);
      } else if (plan.stage === "listening" && content.type === "vocabulary") {
        step = buildListeningRecallStep(content, allAnswers, runningIndex + index + 1, total, plan.stage);
      } else if (plan.stage === "context_application") {
        const sentence = buildSentenceTypedStep(
          content as VocabularyLessonContent,
          runningIndex + index + 1,
          total,
        );
        step = sentence ? { ...sentence, stage: plan.stage } : null;
      } else if (plan.stage === "review_injection") {
        step = buildActiveRecallStep(content, allAnswers, runningIndex + index + 1, total, plan.stage);
      } else if (plan.stage === "mastery_challenge") {
        step = buildMasteryChallengeStep(content, allAnswers, runningIndex + index + 1, total);
      }

      if (step) rawSteps.push(step);
    }
    runningIndex += plan.count;
  }

  return rawSteps;
}

function trimToExerciseBounds(steps: ScoredLessonStep[]): ScoredLessonStep[] {
  if (steps.length <= LESSON_MAX_SCORED_EXERCISES) return steps;
  return steps.slice(0, LESSON_MAX_SCORED_EXERCISES);
}

function reindexSteps(steps: ScoredLessonStep[]): ScoredLessonStep[] {
  const total = steps.length;
  return steps.map((step, index) => ({
    ...step,
    index: index + 1,
    total,
  }));
}

function buildStageSummary(steps: ScoredLessonStep[]): LessonStageSummary[] {
  const counts = new Map<LessonStage, number>();
  for (const step of steps) {
    if (step.stage) {
      counts.set(step.stage, (counts.get(step.stage) ?? 0) + 1);
    }
  }
  return LESSON_STAGES.filter((stage) => (counts.get(stage) ?? 0) > 0).map((stage) => ({
    stage,
    label: STAGE_LABELS[stage],
    exerciseCount: counts.get(stage) ?? 0,
  }));
}

function buildPhaseSummary(steps: ScoredLessonStep[]): LessonPhaseSummary[] {
  const counts = new Map<LessonPhase, number>();
  for (const step of steps) {
    if (step.lessonPhase) {
      counts.set(step.lessonPhase, (counts.get(step.lessonPhase) ?? 0) + 1);
    }
  }
  return (["introduction", "recognition", "active_recall", "context_mastery"] as LessonPhase[])
    .filter((phase) => (counts.get(phase) ?? 0) > 0)
    .map((phase) => ({
      phase,
      label: PHASE_LABELS[phase],
      exerciseCount: counts.get(phase) ?? 0,
    }));
}

export function assembleStagedExerciseSteps(
  input: StagedLessonAssemblyInput,
): { steps: ScoredLessonStep[]; stageSummary: LessonStageSummary[]; phaseSummary: LessonPhaseSummary[] } {
  const drillNew = input.newContents.filter(isDrillContent);
  const drillReview = input.reviewContents.filter(isDrillContent);
  const primaryPool =
    input.isCheckpoint || drillNew.length === 0 ? drillReview : drillNew;

  const allPool = [
    ...primaryPool,
    ...drillReview.filter((c) => !primaryPool.some((p) => p.id === c.id)),
  ];
  const allAnswers = allPool.map(getRecallAnswer);
  const allSurfaces = allPool.map(getJapaneseSurface);

  let rawSteps: ScoredLessonStep[];

  if (input.isCheckpoint) {
    rawSteps = buildCheckpointSteps(drillReview, allAnswers, allSurfaces);
  } else if (drillNew.length > 0) {
    rawSteps = interleaveSpiralExposures(drillNew, allAnswers, allSurfaces);

    const matching = buildMatchingStep(drillNew);
    if (matching) {
      rawSteps.unshift({
        ...matching,
        stage: "recognition",
        lessonPhase: "introduction",
        index: 0,
        total: 0,
      });
    }

    const minReview = Math.ceil(rawSteps.length * LESSON_REVIEW_RATIO_MIN);
    if (drillReview.length > 0 && minReview > 0) {
      const reviewSteps = buildReviewInjectionSteps(
        drillReview,
        allAnswers,
        Math.max(2, minReview),
        rawSteps.length,
        rawSteps.length + minReview,
      );
      rawSteps.push(...reviewSteps);
    }
  } else {
    rawSteps = buildCheckpointSteps(allPool, allAnswers, allSurfaces);
  }

  const bounded = trimToExerciseBounds(rawSteps);
  const varied = enforceExerciseVariety(bounded);
  const indexed = reindexSteps(varied);

  return {
    steps: indexed,
    stageSummary: buildStageSummary(indexed),
    phaseSummary: buildPhaseSummary(indexed),
  };
}

export function summarizeLessonStages(steps: LessonStep[]): LessonStageSummary[] {
  const counts = new Map<LessonStage, number>();

  for (const step of steps) {
    if (step.kind === "teach") {
      counts.set("introduction", (counts.get("introduction") ?? 0) + 1);
      continue;
    }
    if ("stage" in step && step.stage) {
      counts.set(step.stage, (counts.get(step.stage) ?? 0) + 1);
    }
  }

  return LESSON_STAGES.filter((stage) => (counts.get(stage) ?? 0) > 0).map((stage) => ({
    stage,
    label: STAGE_LABELS[stage],
    exerciseCount: counts.get(stage) ?? 0,
  }));
}

export { summarizeLessonPhases };

export function hasListeningAudio(contents: LessonContent[]): boolean {
  return contents.some(
    (content): content is VocabularyLessonContent =>
      content.type === "vocabulary" && content.audioUrl != null,
  );
}

function buildRecallReviewStep(
  content: LessonContent,
  allAnswers: string[],
  index: number,
  total: number,
): LessonRecallStep | null {
  return buildActiveRecallStep(content, allAnswers, index, total, "review_injection");
}
