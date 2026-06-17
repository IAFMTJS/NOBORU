import type { VocabularyLifecycleStage } from "@/lib/learning/learning-architecture.constants";
import type { LessonRecallPhase } from "@/features/learning/types/lesson.types";

export function resolveLifecycleStageFromPhase(
  phase?: LessonRecallPhase,
  override?: VocabularyLifecycleStage,
): VocabularyLifecycleStage {
  if (override) return override;
  if (phase === "consolidation") return "reinforced";
  return "discovered";
}
