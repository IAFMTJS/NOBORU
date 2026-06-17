export const BOSS_EXAM_ACTIVITY_TYPES = [
  "reading",
  "listening",
  "writing",
  "grammar",
  "story_comprehension",
  "applied_vocabulary",
] as const;

export type BossExamActivityType = (typeof BOSS_EXAM_ACTIVITY_TYPES)[number];

export type BossExamStepPlan = {
  type: BossExamActivityType;
  contentIds: string[];
  weight: number;
};

export function planBossExamination(input: {
  vocabularyIds: string[];
  grammarIds: string[];
  readingIds: string[];
  listeningIds: string[];
  storyIds: string[];
  applicationIds: string[];
}): BossExamStepPlan[] {
  const steps: BossExamStepPlan[] = [];

  if (input.vocabularyIds.length > 0) {
    steps.push({
      type: "applied_vocabulary",
      contentIds: input.vocabularyIds,
      weight: 0.25,
    });
  }
  if (input.grammarIds.length > 0) {
    steps.push({
      type: "grammar",
      contentIds: input.grammarIds,
      weight: 0.2,
    });
  }
  if (input.readingIds.length > 0) {
    steps.push({
      type: "reading",
      contentIds: input.readingIds,
      weight: 0.15,
    });
  }
  if (input.listeningIds.length > 0) {
    steps.push({
      type: "listening",
      contentIds: input.listeningIds,
      weight: 0.15,
    });
  }
  if (input.storyIds.length > 0) {
    steps.push({
      type: "story_comprehension",
      contentIds: input.storyIds,
      weight: 0.15,
    });
  }
  if (input.applicationIds.length > 0) {
    steps.push({
      type: "writing",
      contentIds: input.applicationIds,
      weight: 0.1,
    });
  }

  return steps;
}

export function bossExamIsProgressionGate(passed: boolean): boolean {
  return passed;
}
