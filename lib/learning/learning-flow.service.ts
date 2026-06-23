import type { LearningFlowStage } from "@/lib/learning/learning-architecture.constants";

/** Maps lesson step kinds to bible learning flow stages. */
const STEP_FLOW_MAP: Record<string, LearningFlowStage> = {
  intro: "discover",
  teach: "discover",
  knowledge_inventory: "discover",
  recall: "practice",
  matching: "reinforce",
  fill_blank: "apply",
  word_bank: "apply",
  sentence_typed: "apply",
  application: "apply",
  listening_recall: "practice",
  reading: "practice",
  story: "apply",
  dialogue: "apply",
  listening: "practice",
  listening_challenge: "test",
  complete: "master",
};

export function resolveFlowStageForStepKind(stepKind: string): LearningFlowStage {
  return STEP_FLOW_MAP[stepKind] ?? "practice";
}

export function isRetentionFlowStage(stage: LearningFlowStage): boolean {
  return stage === "review_forever" || stage === "master" || stage === "reinforce";
}
