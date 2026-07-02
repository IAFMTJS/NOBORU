import type { KnowledgeConcept } from "@/lib/learning/knowledge-block/types";

export type IntroducedConceptRegistry = {
  introducedConceptIds: Set<string>;
  introducedGrammarIds: Set<string>;
  introducedConjugationSurfaces: Set<string>;
  introducedVocabularyIds: Set<string>;
  introducedParticleSurfaces: Set<string>;
};

export function createIntroducedConceptRegistry(
  priorKnownConceptIds: Iterable<string> = [],
): IntroducedConceptRegistry {
  const introducedConceptIds = new Set(priorKnownConceptIds);
  return {
    introducedConceptIds,
    introducedGrammarIds: new Set(),
    introducedVocabularyIds: new Set(),
    introducedConjugationSurfaces: new Set(),
    introducedParticleSurfaces: new Set(),
  };
}

export function registerIntroducedConcept(
  registry: IntroducedConceptRegistry,
  concept: KnowledgeConcept,
): void {
  registry.introducedConceptIds.add(concept.id);

  if (concept.contentType === "vocabulary") {
    registry.introducedVocabularyIds.add(concept.contentId);
  }

  if (concept.contentType === "grammar") {
    registry.introducedGrammarIds.add(concept.contentId);
  }

  if (concept.conceptKind === "particle") {
    const particle = concept.surface.replace(/\s*\([^)]*\)\s*$/, "").trim();
    registry.introducedParticleSurfaces.add(particle);
  }

  if (concept.conceptKind === "conjugation") {
    for (const step of concept.teachingSteps ?? []) {
      registry.introducedConjugationSurfaces.add(step.japanese);
    }
    registry.introducedConjugationSurfaces.add(concept.surface);
  }
}

export function isConceptIntroduced(
  registry: IntroducedConceptRegistry,
  conceptId: string,
): boolean {
  return registry.introducedConceptIds.has(conceptId);
}

export function hasIntroducedConjugationForStem(
  registry: IntroducedConceptRegistry,
  stem: string,
): boolean {
  return registry.introducedConjugationSurfaces.has(stem);
}
