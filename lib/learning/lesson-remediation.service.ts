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

export type LessonFailureRecord = {
  contentId: string;
  failureCount: number;
  remediated: boolean;
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
): ScoredLessonStep | null {
  if (!isDrillContent(content)) return null;

  const stage = REMEDIATION_STAGES[(failureCount - 1) % REMEDIATION_STAGES.length]!;

  if (stage === "guided_practice" && content.type === "vocabulary" && content.audioUrl) {
    return buildListeningRecallStep(content, allAnswers, index, total, stage);
  }

  if (stage === "guided_practice" && (content.type === "grammar" || content.type === "vocabulary")) {
    const fillBlank = buildFillBlankStep(content, drillPool, index, total);
    if (fillBlank) return { ...fillBlank, stage };
  }

  if (stage === "active_recall") {
    return buildActiveRecallStep(content, allAnswers, index, total, stage);
  }

  if (stage === "context_application") {
    const recall = buildActiveRecallStep(content, allAnswers, index, total, stage);
    if (recall) return recall;
  }

  const variant = failureCount % 2 === 0
    ? buildReverseRecognitionStep(content, drillPool.japaneseSurfaces, index, total, stage)
    : buildRecognitionChoiceStep(content, allAnswers, index, total, stage);

  return variant;
}

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
