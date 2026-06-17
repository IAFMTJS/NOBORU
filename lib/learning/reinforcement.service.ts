import type { PlayerKnowledgeContext } from "@/lib/learning/learning-architecture.types";

export type ReinforcementTarget = {
  vocabularyId: string;
  priority: "weak" | "recent" | "due" | "mastered_maintenance" | "active";
};

export function selectReinforcementTargets(
  context: PlayerKnowledgeContext,
  limit: number,
  excludeIds: ReadonlySet<string> = new Set(),
): ReinforcementTarget[] {
  const targets: ReinforcementTarget[] = [];
  const seen = new Set<string>();

  const push = (vocabularyId: string, priority: ReinforcementTarget["priority"]) => {
    if (excludeIds.has(vocabularyId) || seen.has(vocabularyId)) return;
    seen.add(vocabularyId);
    targets.push({ vocabularyId, priority });
  };

  for (const id of context.weakVocabularyIds) {
    push(id, "weak");
    if (targets.length >= limit) return targets;
  }

  for (const id of context.activeVocabularyPool) {
    if (context.knownVocabularyIds.includes(id) && !context.weakVocabularyIds.includes(id)) {
      push(id, "active");
    }
    if (targets.length >= limit) return targets;
  }

  for (const id of context.masteredVocabularyIds) {
    push(id, "mastered_maintenance");
    if (targets.length >= limit) return targets;
  }

  return targets.slice(0, limit);
}

export function reinforcementTargetIds(
  context: PlayerKnowledgeContext,
  limit: number,
  excludeIds?: ReadonlySet<string>,
): string[] {
  return selectReinforcementTargets(context, limit, excludeIds).map(
    (target) => target.vocabularyId,
  );
}
