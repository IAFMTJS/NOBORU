export type {
  LearningLayer,
  ConceptKind,
  KnowledgeBlockPhase,
  GrammarConceptKind,
  TeachingStep,
  KnowledgeConcept,
  KnowledgeBlock,
  DecomposeLessonInput,
  BlankTarget,
} from "@/lib/learning/knowledge-block/types";

export { LEARNING_LAYER_LABELS } from "@/lib/learning/knowledge-block/types";

export {
  detectGrammarConceptKind,
  grammarConceptKindToConceptKind,
  isVerbVocabulary,
  parseTeachingStepsFromExplanation,
  buildConceptFromContent,
  learningLayersForConcept,
} from "@/lib/learning/knowledge-block/concept-detection";

export {
  createIntroducedConceptRegistry,
  registerIntroducedConcept,
  isConceptIntroduced,
  hasIntroducedConjugationForStem,
  type IntroducedConceptRegistry,
} from "@/lib/learning/knowledge-block/introduced-concept-registry";

export {
  decomposeLessonIntoBlocks,
  getGrammarConceptKindForContent,
} from "@/lib/learning/knowledge-block/decomposer";

export {
  assembleKnowledgeBlockSteps,
  buildStagedInputFromBlocks,
  type BlockAssemblyInput,
  type BlockAssemblyResult,
} from "@/lib/learning/knowledge-block/block-assembly.service";
