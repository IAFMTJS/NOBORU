import type { LessonStep, ScoredLessonStep } from "@/features/learning/types/lesson.types";
import type { IntroducedConceptRegistry } from "@/lib/learning/knowledge-block/introduced-concept-registry";
import type { ContentKnowledgeId } from "@/lib/learning/learning-architecture.types";

export type RequiredConcept = {
  id: ContentKnowledgeId;
  type: "vocabulary" | "grammar" | "kanji" | "conjugation" | "particle";
  surface?: string;
};

export type StepValidationResult = {
  valid: boolean;
  unknownConceptIds: ContentKnowledgeId[];
  reason?: string;
};

export function extractRequiredConceptsFromStep(step: LessonStep): RequiredConcept[] {
  const concepts: RequiredConcept[] = [];

  if ("contentId" in step && step.contentId) {
    const contentType =
      step.kind === "recall"
        ? step.contentType
        : step.kind === "fill_blank" ||
            step.kind === "word_bank" ||
            step.kind === "sentence_typed" ||
            step.kind === "listening_recall"
          ? inferContentTypeFromStep(step)
          : "vocabulary";

    concepts.push({
      id: `${contentType}:${step.contentId}`,
      type: contentType === "grammar" ? "grammar" : contentType === "kanji" ? "kanji" : "vocabulary",
    });
  }

  if (step.kind === "fill_blank" && step.blankTarget === "conjugation") {
    const correct = step.options[step.correctIndex]?.japanese;
    if (correct) {
      concepts.push({ id: `conjugation:${correct}`, type: "conjugation", surface: correct });
    }
  }

  if (step.kind === "fill_blank" && step.blankTarget === "particle") {
    const correct = step.options[step.correctIndex]?.japanese;
    if (correct) {
      concepts.push({ id: `particle:${correct}`, type: "particle", surface: correct });
    }
  }

  if (step.kind === "conjugation") {
    concepts.push({
      id: `conjugation:${step.targetForm}`,
      type: "conjugation",
      surface: step.targetForm,
    });
  }

  if (step.kind === "matching" && step.contentIds) {
    for (const contentId of step.contentIds) {
      concepts.push({ id: `vocabulary:${contentId}`, type: "vocabulary" });
    }
  }

  return concepts;
}

function inferContentTypeFromStep(
  step: ScoredLessonStep,
): "vocabulary" | "grammar" | "kanji" {
  if (step.kind === "recall") return step.contentType as "vocabulary" | "grammar" | "kanji";
  return "vocabulary";
}

export function validateStepAgainstRegistry(
  step: LessonStep,
  registry: IntroducedConceptRegistry,
  priorKnownConceptIds: ReadonlySet<string>,
): StepValidationResult {
  const required = extractRequiredConceptsFromStep(step);
  const unknown: ContentKnowledgeId[] = [];

  for (const concept of required) {
    if (priorKnownConceptIds.has(concept.id)) continue;
    if (registry.introducedConceptIds.has(concept.id)) continue;

    if (concept.type === "conjugation" && concept.surface) {
      if (registry.introducedConjugationSurfaces.has(concept.surface)) continue;
      unknown.push(concept.id);
      continue;
    }

    if (concept.type === "particle" && concept.surface) {
      if (registry.introducedParticleSurfaces.has(concept.surface)) continue;
      unknown.push(concept.id);
      continue;
    }

    unknown.push(concept.id);
  }

  if (
    step.kind === "fill_blank" &&
    step.blankTarget === "conjugation" &&
    unknown.length > 0
  ) {
    return {
      valid: false,
      unknownConceptIds: unknown,
      reason: "Conjugation blank requires prior conjugation introduction",
    };
  }

  return {
    valid: unknown.length === 0,
    unknownConceptIds: unknown,
  };
}

export function assertStepAllowed(
  step: LessonStep,
  registry: IntroducedConceptRegistry,
  priorKnownConceptIds: ReadonlySet<string>,
  context: string,
): void {
  const result = validateStepAgainstRegistry(step, registry, priorKnownConceptIds);
  if (!result.valid) {
    throw new Error(
      `Golden content rule violated in ${context}: unknown concepts ${result.unknownConceptIds.join(", ")}${result.reason ? ` (${result.reason})` : ""}`,
    );
  }
}

export function filterStepsByGoldenRule(
  steps: LessonStep[],
  registry: IntroducedConceptRegistry,
  priorKnownConceptIds: ReadonlySet<string>,
): LessonStep[] {
  const filtered: LessonStep[] = [];
  const workingRegistry = {
    introducedConceptIds: new Set(registry.introducedConceptIds),
    introducedGrammarIds: new Set(registry.introducedGrammarIds),
    introducedVocabularyIds: new Set(registry.introducedVocabularyIds),
    introducedConjugationSurfaces: new Set(registry.introducedConjugationSurfaces),
    introducedParticleSurfaces: new Set(registry.introducedParticleSurfaces),
  };

  for (const step of steps) {
    const result = validateStepAgainstRegistry(step, workingRegistry, priorKnownConceptIds);
    if (!result.valid) continue;
    filtered.push(step);

    if (step.kind === "teach" && "content" in step) {
      const content = step.content;
      const conceptId = `${content.type}:${content.id}`;
      workingRegistry.introducedConceptIds.add(conceptId);
    }
  }

  return filtered;
}
