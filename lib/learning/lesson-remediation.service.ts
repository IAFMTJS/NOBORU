import type {
  LessonContent,
  LessonStep,
  ScoredLessonStep,
} from "@/features/learning/types/lesson.types";
import {
  buildActiveRecallStep,
  buildFillBlankStep,
  buildLessonDrillPoolContext,
  buildListeningRecallStep,
  buildRecognitionChoiceStep,
  buildReverseRecognitionStep,
  getRecallAnswer,
  shuffle,
  type LessonDrillPoolContext,
} from "@/features/learning/utils/exercise-steps";
import type { LessonStage } from "@/lib/learning/lesson-stage.constants";

import type { LearningLayer } from "@/lib/learning/knowledge-block/types";
import { layerExerciseType } from "@/lib/learning/layer-mastery.service";

export type LessonFailureRecord = {
  contentId: string;
  failureCount: number;
  remediated: boolean;
  learningLayer?: LearningLayer;
};

const REMEDIATION_STAGES: ScoredLessonStage[] = [
  "guided_practice",
  "active_recall",
  "context_application",
  "recognition",
];

type ScoredLessonStage = Exclude<LessonStage, "introduction">;

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

export function buildRemediationStep(
  content: LessonContent,
  allAnswers: string[],
  drillPool: LessonDrillPoolContext,
  failureCount: number,
  index: number,
  total: number,
  learningLayer?: LearningLayer,
): ScoredLessonStep | null {
  if (!isDrillContent(content)) return null;

  const stage = REMEDIATION_STAGES[(failureCount - 1) % REMEDIATION_STAGES.length]!;
  const layerMeta = learningLayer
    ? { learningLayer, learningObjective: `Reinforce ${learningLayer.replace(/_/g, " ")}` }
    : {};

  if (stage === "guided_practice" && content.type === "vocabulary" && content.audioUrl) {
    const step = buildListeningRecallStep(content, allAnswers, index, total, stage);
    return step ? { ...step, ...layerMeta, stage } : null;
  }

  if (stage === "guided_practice" && (content.type === "grammar" || content.type === "vocabulary")) {
    const fillBlank = buildFillBlankStep(content, drillPool, index, total);
    if (fillBlank) return { ...fillBlank, ...layerMeta, stage };
  }

  if (stage === "active_recall") {
    const step = buildActiveRecallStep(content, allAnswers, index, total, stage);
    return step ? { ...step, ...layerMeta, stage } : null;
  }

  if (stage === "context_application") {
    const recall = buildActiveRecallStep(content, allAnswers, index, total, stage);
    if (recall) return { ...recall, ...layerMeta, stage };
  }

  const variant = failureCount % 2 === 0
    ? buildReverseRecognitionStep(content, drillPool, index, total, stage)
    : buildRecognitionChoiceStep(content, allAnswers, index, total, stage);

  return variant ? { ...variant, ...layerMeta, stage } : null;
}

export function recordLayerMiss(
  missCounts: Map<LearningLayer, number>,
  layer?: LearningLayer,
): void {
  if (!layer) return;
  missCounts.set(layer, (missCounts.get(layer) ?? 0) + 1);
}

export { layerExerciseType };

export function insertRemediationStep(
  steps: LessonStep[],
  afterIndex: number,
  remediationStep: ScoredLessonStep,
  offset = 2,
): LessonStep[] {
  const insertAt = Math.min(afterIndex + offset + 1, steps.length);
  const next = [...steps];
  next.splice(insertAt, 0, remediationStep);
  return next;
}

export function getUnresolvedFailureIds(
  failures: ReadonlyMap<string, LessonFailureRecord>,
): string[] {
  return Array.from(failures.values())
    .filter((record) => !record.remediated)
    .map((record) => record.contentId);
}

export function buildFinalRemediationBatch(
  unresolvedIds: string[],
  contentById: Record<string, LessonContent>,
  startIndex: number,
): ScoredLessonStep[] {
  const pool = unresolvedIds
    .map((id) => contentById[id])
    .filter((content): content is LessonContent => content != null && isDrillContent(content));

  if (pool.length === 0) return [];

  const allAnswers = pool.map(getRecallAnswer);
  const drillPool = buildLessonDrillPoolContext(pool);

  return pool
    .map((content, offset) =>
      buildRemediationStep(
        content,
        allAnswers,
        drillPool,
        2,
        startIndex + offset + 1,
        pool.length,
      ),
    )
    .filter((step): step is ScoredLessonStep => step != null);
}
