import type { PlayerKnowledgeContext } from "@/lib/learning/learning-architecture.types";

export type CompanionVocabularySnippet = {
  vocabularyId: string;
  display: string;
  meaning: string;
  usage: "dialogue" | "reminder" | "challenge" | "mini_game" | "story_event";
};

export function selectCompanionVocabularySnippets(
  context: PlayerKnowledgeContext,
  vocabularyDisplay: ReadonlyMap<string, { display: string; meaning: string }>,
  limit = 3,
): CompanionVocabularySnippet[] {
  const prioritized = [
    ...context.weakVocabularyIds,
    ...context.activeVocabularyPool,
    ...context.masteredVocabularyIds,
  ];

  const snippets: CompanionVocabularySnippet[] = [];
  const seen = new Set<string>();

  for (const vocabularyId of prioritized) {
    if (seen.has(vocabularyId)) continue;
    const entry = vocabularyDisplay.get(vocabularyId);
    if (!entry) continue;

    seen.add(vocabularyId);
    snippets.push({
      vocabularyId,
      display: entry.display,
      meaning: entry.meaning,
      usage: context.weakVocabularyIds.includes(vocabularyId)
        ? "reminder"
        : "dialogue",
    });

    if (snippets.length >= limit) break;
  }

  return snippets;
}

export function buildCompanionDialogueLine(
  snippets: CompanionVocabularySnippet[],
): string {
  if (snippets.length === 0) {
    return "Keep climbing — small steps build lasting memory.";
  }

  const focus = snippets[0]!;
  return `Let's reinforce "${focus.display}" (${focus.meaning}) on today's trail.`;
}
