import { validateGoldenContentRule } from "@/lib/learning/golden-content.validator";
import { filterGrammarIdsToKnown } from "@/lib/learning/grammar-progression.service";
import type { PlayerKnowledgeContext } from "@/lib/learning/learning-architecture.types";

export type ContentEligibilityResult = {
  eligible: boolean;
  unknownVocabularyIds: string[];
  unknownGrammarIds: string[];
};

export function evaluateContentEligibility(
  requiredVocabularyIds: string[],
  requiredGrammarIds: string[],
  context: PlayerKnowledgeContext,
): ContentEligibilityResult {
  const knownVocabulary = new Set(context.knownVocabularyIds);
  const knownGrammar = new Set(context.knownGrammarIds);

  const vocabularyCheck = validateGoldenContentRule(
    requiredVocabularyIds,
    knownVocabulary,
  );

  const allowedGrammar = filterGrammarIdsToKnown(requiredGrammarIds, knownGrammar);
  const unknownGrammarIds = requiredGrammarIds.filter(
    (id) => !knownGrammar.has(id),
  );

  return {
    eligible: vocabularyCheck.valid && unknownGrammarIds.length === 0,
    unknownVocabularyIds: vocabularyCheck.unknownContentIds,
    unknownGrammarIds,
  };
}

export function assertContentEligibility(
  requiredVocabularyIds: string[],
  requiredGrammarIds: string[],
  context: PlayerKnowledgeContext,
  contextLabel: string,
): void {
  const result = evaluateContentEligibility(
    requiredVocabularyIds,
    requiredGrammarIds,
    context,
  );

  if (!result.eligible) {
    const parts: string[] = [];
    if (result.unknownVocabularyIds.length > 0) {
      parts.push(`vocabulary: ${result.unknownVocabularyIds.join(", ")}`);
    }
    if (result.unknownGrammarIds.length > 0) {
      parts.push(`grammar: ${result.unknownGrammarIds.join(", ")}`);
    }
    throw new Error(`Golden content rule violated in ${contextLabel}: ${parts.join("; ")}`);
  }
}
