import type { LessonPhaseSummary, LessonStep } from "@/features/learning/types/lesson.types";
import {
  LESSON_PHASES,
  PHASE_LABELS,
  resolvePhaseFromStage,
  type LessonPhase,
} from "@/lib/learning/lesson-phase.constants";

export function resolveStepPhase(step: LessonStep): LessonPhase | null {
  if ("lessonPhase" in step && step.lessonPhase) {
    return step.lessonPhase;
  }
  if (step.kind === "teach") return "introduction";
  if (
    step.kind === "story" ||
    step.kind === "dialogue" ||
    step.kind === "listening" ||
    step.kind === "listening_challenge" ||
    step.kind === "reading" ||
    step.kind === "application"
  ) {
    return "context_mastery";
  }
  if ("stage" in step && step.stage) {
    return resolvePhaseFromStage(step.stage);
  }
  return null;
}

export function summarizeLessonPhases(steps: LessonStep[]): LessonPhaseSummary[] {
  const counts = new Map<LessonPhase, number>();

  for (const step of steps) {
    if (step.kind === "intro" || step.kind === "complete") continue;

    const phase = resolveStepPhase(step);
    if (!phase) continue;

    counts.set(phase, (counts.get(phase) ?? 0) + 1);
  }

  return LESSON_PHASES.filter((phase) => (counts.get(phase) ?? 0) > 0).map((phase) => ({
    phase,
    label: PHASE_LABELS[phase],
    exerciseCount: counts.get(phase) ?? 0,
  }));
}

export function getContentIdFromStep(step: LessonStep): string | null {
  if ("contentId" in step && typeof step.contentId === "string") {
    return step.contentId;
  }
  if (step.kind === "matching" && step.contentIds?.length) {
    return step.contentIds[0] ?? null;
  }
  if (step.kind === "teach") {
    return step.content.id;
  }
  return null;
}
