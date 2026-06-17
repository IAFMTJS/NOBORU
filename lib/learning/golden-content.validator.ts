import type {
  ContentKnowledgeId,
  GoldenContentValidationResult,
} from "@/lib/learning/learning-architecture.types";

/**
 * Golden Content Rule — no learning activity may require vocabulary not yet introduced.
 * Call at service boundaries for lessons, stories, quests, exams, companion content, etc.
 */
export function validateGoldenContentRule(
  requiredContentIds: ContentKnowledgeId[],
  knownContentIds: ReadonlySet<ContentKnowledgeId>,
): GoldenContentValidationResult {
  const unknownContentIds = requiredContentIds.filter(
    (id) => !knownContentIds.has(id),
  );

  return {
    valid: unknownContentIds.length === 0,
    unknownContentIds: Array.from(new Set(unknownContentIds)),
  };
}

export function assertGoldenContentRule(
  requiredContentIds: ContentKnowledgeId[],
  knownContentIds: ReadonlySet<ContentKnowledgeId>,
  context: string,
): void {
  const result = validateGoldenContentRule(requiredContentIds, knownContentIds);
  if (!result.valid) {
    throw new Error(
      `Golden content rule violated in ${context}: unknown ids ${result.unknownContentIds.join(", ")}`,
    );
  }
}
