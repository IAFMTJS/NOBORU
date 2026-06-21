import type {
  LessonContent,
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

export type StagedLessonAssemblyInput = {
  newContents: LessonContent[];
  reviewContents: LessonContent[];
  isCheckpoint: boolean;
};

type StagePlan = {
  stage: ScoredLessonStage;
  count: number;
};

function isDrillContent(
  content: LessonContent,
): content is Exclude<LessonContent, { type: "reading" | "story" | "dialogue" | "listening" | "listening_challenge" | "application" }> {
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

function pickContents(
  pool: LessonContent[],
  count: number,
  offset: number,
): LessonContent[] {
  if (pool.length === 0 || count <= 0) return [];
  const shuffled = shuffle(pool);
  const picked: LessonContent[] = [];
  for (let index = 0; index < count; index += 1) {
    picked.push(shuffled[(offset + index) % shuffled.length]!);
  }
  return picked;
}

function buildStageSteps(
  stage: ScoredLessonStage,
  contents: LessonContent[],
  allAnswers: string[],
  allSurfaces: string[],
  startIndex: number,
  total: number,
): ScoredLessonStep[] {
  const steps: ScoredLessonStep[] = [];

  contents.forEach((content, contentIndex) => {
    const drillIndex = startIndex + contentIndex + 1;

    if (stage === "recognition") {
      const forward =
        contentIndex % 2 === 0
          ? buildRecognitionChoiceStep(content, allAnswers, drillIndex, total, stage)
          : buildReverseRecognitionStep(content, allSurfaces, drillIndex, total, stage);
      if (forward) steps.push(forward);
      return;
    }

    if (stage === "guided_practice") {
      const variety = buildVarietyStep(content, allAnswers, contentIndex, drillIndex, total);
      if (variety) {
        steps.push({ ...variety, stage } as ScoredLessonStep);
        return;
      }
      if (content.type === "grammar" || content.type === "vocabulary") {
        const fillBlank = buildFillBlankStep(content, allAnswers, drillIndex, total);
        if (fillBlank) {
          steps.push({ ...fillBlank, stage });
          return;
        }
      }
      const choice = buildRecognitionChoiceStep(content, allAnswers, drillIndex, total, stage);
      if (choice) steps.push(choice);
      return;
    }

    if (stage === "active_recall") {
      const recall = buildActiveRecallStep(content, allAnswers, drillIndex, total, stage);
      if (recall) steps.push(recall);
      return;
    }

    if (stage === "listening") {
      if (content.type === "vocabulary") {
        const listening = buildListeningRecallStep(
          content,
          allAnswers,
          drillIndex,
          total,
          stage,
        );
        if (listening) {
          steps.push(listening);
          return;
        }
      }
      const fallback = buildRecognitionChoiceStep(content, allAnswers, drillIndex, total, stage);
      if (fallback) steps.push(fallback);
      return;
    }

    if (stage === "context_application") {
      if (content.type === "grammar" || content.type === "vocabulary") {
        const variant = contentIndex % 2;
        if (variant === 0) {
          const sentence = buildSentenceTypedStep(content, drillIndex, total);
          if (sentence) {
            steps.push({ ...sentence, stage, prompt: "Translate into Japanese" });
            return;
          }
        } else {
          const wordBank = buildWordBankStep(content, drillIndex, total);
          if (wordBank) {
            steps.push({ ...wordBank, stage, prompt: "Build the sentence" });
            return;
          }
        }
        const fillBlank = buildFillBlankStep(content, allAnswers, drillIndex, total);
        if (fillBlank) {
          steps.push({ ...fillBlank, stage });
          return;
        }
      }
      const recall = buildActiveRecallStep(content, allAnswers, drillIndex, total, stage);
      if (recall) steps.push(recall);
      return;
    }

    if (stage === "review_injection") {
      const variety = buildVarietyStep(
        content,
        allAnswers,
        contentIndex + 3,
        drillIndex,
        total,
      );
      if (variety) {
        steps.push({ ...variety, stage } as ScoredLessonStep);
        return;
      }
      const recall = buildRecallReviewStep(content, allAnswers, drillIndex, total);
      if (recall) steps.push(recall);
      return;
    }

    if (stage === "mastery_challenge") {
      const mastery = buildMasteryChallengeStep(content, allAnswers, drillIndex, total);
      if (mastery) steps.push(mastery);
    }
  });

  return steps;
}

function buildRecallReviewStep(
  content: LessonContent,
  allAnswers: string[],
  index: number,
  total: number,
): LessonRecallStep | null {
  return buildActiveRecallStep(content, allAnswers, index, total, "review_injection");
}

export function assembleStagedExerciseSteps(
  input: StagedLessonAssemblyInput,
): { steps: ScoredLessonStep[]; stageSummary: LessonStageSummary[] } {
  const drillNew = input.newContents.filter(isDrillContent);
  const drillReview = input.reviewContents.filter(isDrillContent);
  const primaryPool =
    input.isCheckpoint || drillNew.length === 0 ? drillReview : drillNew;

  const allPool = [...primaryPool, ...drillReview.filter((c) => !primaryPool.some((p) => p.id === c.id))];
  const allAnswers = allPool.map(getRecallAnswer);
  const allSurfaces = allPool.map(getJapaneseSurface);

  const stagePlans = computeStagePlans(drillNew.length, input.isCheckpoint);
  const totalScored = stagePlans.reduce((sum, plan) => sum + plan.count, 0);

  const minReview = Math.ceil(totalScored * LESSON_REVIEW_RATIO_MIN);
  const reviewStagePlan = stagePlans.find((plan) => plan.stage === "review_injection");
  if (reviewStagePlan && drillReview.length > 0) {
    reviewStagePlan.count = Math.max(reviewStagePlan.count, minReview);
  }

  const adjustedTotal = stagePlans.reduce((sum, plan) => sum + plan.count, 0);
  const stageSummary: LessonStageSummary[] = [];
  const rawSteps: ScoredLessonStep[] = [];
  let runningIndex = 0;

  for (const plan of stagePlans) {
    const contentPool =
      plan.stage === "review_injection"
        ? drillReview.length > 0
          ? drillReview
          : allPool
        : primaryPool.length > 0
          ? primaryPool
          : allPool;

    const stageContents = pickContents(contentPool, plan.count, runningIndex);
    const stageSteps = buildStageSteps(
      plan.stage,
      stageContents,
      allAnswers,
      allSurfaces,
      runningIndex,
      adjustedTotal,
    );

    rawSteps.push(...stageSteps.slice(0, plan.count));
    runningIndex += stageSteps.length;

    stageSummary.push({
      stage: plan.stage,
      label: STAGE_LABELS[plan.stage],
      exerciseCount: Math.min(plan.count, stageSteps.length),
    });
  }

  const varied = enforceExerciseVariety(rawSteps);

  const indexed = varied.map((step, index) => ({
    ...step,
    index: index + 1,
    total: varied.length,
  }));

  return { steps: indexed, stageSummary };
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

export function hasListeningAudio(contents: LessonContent[]): boolean {
  return contents.some(
    (content): content is VocabularyLessonContent =>
      content.type === "vocabulary" && content.audioUrl != null,
  );
}
