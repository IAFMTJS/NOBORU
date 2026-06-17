import type { PlayerKnowledgeContext } from "@/lib/learning/learning-architecture.types";

export type StorySectionInput = {
  id: string;
  japaneseText: string;
  linkedVocabularyIds?: string[];
};

export type StoryTokenAnnotation = {
  token: string;
  isKnown: boolean;
  isMastered: boolean;
  shouldHighlight: boolean;
  vocabularyId?: string;
};

export type AssembledStorySection = StorySectionInput & {
  annotations: StoryTokenAnnotation[];
  usesOnlyAllowedVocabulary: boolean;
};

export type StoryAssemblyResult = {
  sections: AssembledStorySection[];
  allowedVocabularyIds: string[];
  highlightedVocabularyIds: string[];
  eligible: boolean;
};

const TOKEN_PATTERN = /[\u3040-\u9fff\u30a0-\u30ff]+/g;

function tokenizeJapanese(text: string): string[] {
  const matches = text.match(TOKEN_PATTERN);
  return matches ? Array.from(new Set(matches)) : [];
}

export function assembleStoryForPlayer(
  sections: StorySectionInput[],
  context: PlayerKnowledgeContext,
  vocabularyLookup: ReadonlyMap<string, { id: string; surfaceForms: string[] }>,
): StoryAssemblyResult {
  const allowedVocabularyIds = new Set([
    ...context.activeVocabularyPool,
    ...context.masteredVocabularyIds,
  ]);
  const knownVocabulary = new Set(context.knownVocabularyIds);
  const masteredVocabulary = new Set(context.masteredVocabularyIds);
  const highlightedVocabularyIds = new Set<string>();

  const assembledSections = sections.map((section) => {
    const linkedIds = section.linkedVocabularyIds ?? [];
    const tokens = tokenizeJapanese(section.japaneseText);

    const annotations: StoryTokenAnnotation[] = tokens.map((token) => {
      let vocabularyId: string | undefined;
      for (const [id, entry] of vocabularyLookup) {
        if (entry.surfaceForms.some((form) => token.includes(form) || form.includes(token))) {
          vocabularyId = id;
          break;
        }
      }

      const isKnown = vocabularyId ? knownVocabulary.has(vocabularyId) : false;
      const isMastered = vocabularyId ? masteredVocabulary.has(vocabularyId) : false;
      const isAllowed = vocabularyId ? allowedVocabularyIds.has(vocabularyId) : isKnown;
      const shouldHighlight = Boolean(vocabularyId && !isAllowed);

      if (shouldHighlight && vocabularyId) {
        highlightedVocabularyIds.add(vocabularyId);
      }

      return {
        token,
        isKnown,
        isMastered,
        shouldHighlight,
        vocabularyId,
      };
    });

    const usesOnlyAllowedVocabulary =
      linkedIds.every((id) => allowedVocabularyIds.has(id) || knownVocabulary.has(id)) &&
      annotations.every((annotation) => !annotation.shouldHighlight);

    return {
      ...section,
      annotations,
      usesOnlyAllowedVocabulary,
    };
  });

  return {
    sections: assembledSections,
    allowedVocabularyIds: Array.from(allowedVocabularyIds),
    highlightedVocabularyIds: Array.from(highlightedVocabularyIds),
    eligible: assembledSections.every((section) => section.usesOnlyAllowedVocabulary),
  };
}
