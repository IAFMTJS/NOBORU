import type {
  LessonContent,
  LessonStep,
  LessonTeachStep,
  ScoredLessonStep,
} from "@/features/learning/types/lesson.types";
import type { HintVisibility } from "@/lib/learning/hint-policy.service";
import { LEARNING_LAYER_LABELS, type KnowledgeBlock } from "@/lib/learning/knowledge-block/types";
import {
  createIntroducedConceptRegistry,
  registerIntroducedConcept,
  type IntroducedConceptRegistry,
} from "@/lib/learning/knowledge-block/introduced-concept-registry";
import {
  assembleStagedExerciseSteps,
  enforceExerciseVariety,
  type StagedLessonAssemblyInput,
} from "@/lib/learning/lesson-stage-assembly.service";
import {
  LESSON_MAX_SCORED_EXERCISES,
  LESSON_MIN_SCORED_EXERCISES,
} from "@/lib/learning/lesson-stage.constants";
import {
  buildConjugationStep,
  buildParticleChoiceStep,
  buildRecognitionChoiceStep,
  buildReverseRecognitionStep,
  buildListeningRecallStep,
  buildFillBlankStep,
  buildWordBankStep,
  buildSentenceTypedStep,
  buildTranslationChoiceStep,
  buildLessonDrillPoolContext,
  getRecallAnswer,
  shuffle,
  applyHintPolicyToStep,
  resolveFillBlankPrompt,
} from "@/features/learning/utils/exercise-steps";
import type { LearningLayer } from "@/lib/learning/knowledge-block/types";

const MAX_DRILLS_PER_BLOCK = 4;

export type BlockAssemblyInput = {
  blocks: KnowledgeBlock[];
  reviewContents: LessonContent[];
  isCheckpoint: boolean;
  hintPolicy: HintVisibility;
  priorKnownConceptIds: ReadonlySet<string>;
};

export type BlockAssemblyResult = {
  steps: LessonStep[];
  registry: IntroducedConceptRegistry;
};

function buildTeachStep(block: KnowledgeBlock): LessonTeachStep | null {
  if (!block.sourceContent || block.phase === "mastery") return null;
  return {
    kind: "teach",
    content: block.sourceContent,
    index: block.orderIndex + 1,
    total: block.orderIndex + 1,
    stage: "introduction",
    lessonPhase: "introduction",
    learningLayer: "vocab_recognition",
    learningObjective: `Learn: ${block.concept.surface}`,
  };
}

function attachLayerMeta(
  step: ScoredLessonStep,
  layer: LearningLayer,
  objective: string,
  hintPolicy: HintVisibility,
): ScoredLessonStep {
  return applyHintPolicyToStep(
    {
      ...step,
      learningLayer: layer,
      learningObjective: objective,
    },
    hintPolicy,
  );
}

function buildBlockDrills(
  block: KnowledgeBlock,
  allContents: LessonContent[],
  reviewContents: LessonContent[],
  hintPolicy: HintVisibility,
  runningIndex: number,
): ScoredLessonStep[] {
  const content = block.sourceContent;
  if (!content) return [];

  const poolContents = [
    content,
    ...allContents.filter((item) => item.id !== content.id),
    ...reviewContents,
  ];
  const allAnswers = poolContents.map(getRecallAnswer);
  const drillPool = buildLessonDrillPoolContext(poolContents);
  const steps: ScoredLessonStep[] = [];
  let drillIndex = 0;

  const push = (step: ScoredLessonStep | null, layer: LearningLayer, objective: string) => {
    if (!step || drillIndex >= MAX_DRILLS_PER_BLOCK) return;
    steps.push(
      attachLayerMeta(
        { ...step, index: runningIndex + drillIndex + 1, total: runningIndex + MAX_DRILLS_PER_BLOCK },
        layer,
        objective,
        hintPolicy,
      ),
    );
    drillIndex += 1;
  };

  if (block.phase === "combine") {
    if (content.type === "vocabulary" || content.type === "grammar") {
      push(
        buildWordBankStep(content, drillIndex + 1, MAX_DRILLS_PER_BLOCK),
        "sentence_construction",
        "Arrange the sentence.",
      );
      push(
        buildFillBlankStep(content, drillPool, drillIndex + 1, MAX_DRILLS_PER_BLOCK, {
          blankTarget: "word",
        }),
        "sentence_construction",
        resolveFillBlankPrompt("word"),
      );
      push(
        buildTranslationChoiceStep(content, poolContents, drillIndex + 1, MAX_DRILLS_PER_BLOCK),
        "sentence_comprehension",
        "Choose the correct Japanese sentence.",
      );
      push(
        buildSentenceTypedStep(content, drillIndex + 1, MAX_DRILLS_PER_BLOCK),
        "production",
        "Type the full sentence.",
      );
    }
    return steps;
  }

  if (block.phase === "mastery") {
    const masteryContent = allContents.find(
      (item) => item.type === "vocabulary" || item.type === "grammar",
    );
    if (masteryContent && (masteryContent.type === "vocabulary" || masteryContent.type === "grammar")) {
      push(
        buildSentenceTypedStep(masteryContent, drillIndex + 1, MAX_DRILLS_PER_BLOCK),
        "production",
        "Mastery challenge — type the sentence.",
      );
    }
    return steps;
  }

  if (block.conceptKind === "particle" && content.type === "grammar") {
    push(
      buildParticleChoiceStep(content, drillPool, drillIndex + 1, MAX_DRILLS_PER_BLOCK),
      "grammar",
      "Choose the correct particle.",
    );
    return steps;
  }

  if (block.conceptKind === "conjugation" && content.type === "grammar") {
    push(
      buildConjugationStep(content, drillPool, drillIndex + 1, MAX_DRILLS_PER_BLOCK),
      "conjugation",
      "Complete the verb form.",
    );
    return steps;
  }

  if (block.conceptKind === "sentence_order" && (content.type === "grammar" || content.type === "vocabulary")) {
    push(
      buildWordBankStep(content, drillIndex + 1, MAX_DRILLS_PER_BLOCK),
      "sentence_construction",
      "Arrange the words in order.",
    );
    return steps;
  }

  push(
    buildRecognitionChoiceStep(content, allAnswers, drillIndex + 1, MAX_DRILLS_PER_BLOCK),
    "vocab_recognition",
    "Choose the correct meaning.",
  );

  push(
    buildReverseRecognitionStep(content, drillPool, drillIndex + 1, MAX_DRILLS_PER_BLOCK),
    "vocab_recall",
    "Choose the correct Japanese.",
  );

  if (content.type === "vocabulary" && content.audioUrl) {
    push(
      buildListeningRecallStep(content, allAnswers, drillIndex + 1, MAX_DRILLS_PER_BLOCK),
      "listening",
      "Listen and choose the meaning.",
    );
  }

  if (content.type === "grammar") {
    push(
      buildParticleChoiceStep(content, drillPool, drillIndex + 1, MAX_DRILLS_PER_BLOCK) ??
        buildFillBlankStep(content, drillPool, drillIndex + 1, MAX_DRILLS_PER_BLOCK, {
          blankTarget: "grammar_element",
        }),
      "grammar",
      "Apply this grammar pattern.",
    );
  }

  return steps;
}

function trimBlockSteps(steps: ScoredLessonStep[]): ScoredLessonStep[] {
  if (steps.length <= LESSON_MAX_SCORED_EXERCISES) return steps;
  return steps.slice(0, LESSON_MAX_SCORED_EXERCISES);
}

export function assembleKnowledgeBlockSteps(input: BlockAssemblyInput): BlockAssemblyResult {
  const registry = createIntroducedConceptRegistry(input.priorKnownConceptIds);

  for (const conceptId of input.priorKnownConceptIds) {
    registry.introducedConceptIds.add(conceptId);
  }

  if (input.isCheckpoint) {
    const staged = assembleStagedExerciseSteps({
      newContents: [],
      reviewContents: input.reviewContents,
      isCheckpoint: true,
    });
    const steps = staged.steps.map((step) =>
      applyHintPolicyToStep(step, input.hintPolicy),
    );
    return { steps, registry };
  }

  const lessonSteps: LessonStep[] = [];
  const scoredSteps: ScoredLessonStep[] = [];
  const allContents = input.blocks
    .map((block) => block.sourceContent)
    .filter((content): content is LessonContent => content !== null);

  for (const block of input.blocks) {
    if (block.phase === "mastery") continue;

    const teach = buildTeachStep(block);
    if (teach && block.isNew) {
      lessonSteps.push(applyHintPolicyToStep(teach, input.hintPolicy));
      registerIntroducedConcept(registry, block.concept);
    } else if (!block.isNew) {
      registerIntroducedConcept(registry, block.concept);
    }

    const blockDrills = buildBlockDrills(
      block,
      allContents,
      input.reviewContents,
      input.hintPolicy,
      scoredSteps.length,
    );
    scoredSteps.push(...blockDrills);
  }

  const masteryBlock = input.blocks.find((block) => block.phase === "mastery");
  if (masteryBlock) {
    scoredSteps.push(
      ...buildBlockDrills(
        masteryBlock,
        allContents,
        input.reviewContents,
        input.hintPolicy,
        scoredSteps.length,
      ),
    );
  }

  const minReview = Math.max(2, Math.ceil(scoredSteps.length * 0.2));
  if (input.reviewContents.length > 0 && minReview > 0) {
    const reviewPool = shuffle(input.reviewContents.filter(
      (content) =>
        content.type === "vocabulary" ||
        content.type === "kanji" ||
        content.type === "grammar" ||
        content.type === "hiragana" ||
        content.type === "katakana",
    )).slice(0, minReview);
    const reviewAnswers = reviewPool.map(getRecallAnswer);
    for (const [index, content] of reviewPool.entries()) {
      const step = buildRecognitionChoiceStep(
        content,
        reviewAnswers,
        scoredSteps.length + index + 1,
        scoredSteps.length + reviewPool.length,
        "review_injection",
      );
      if (step) {
        scoredSteps.push(
          attachLayerMeta(
            { ...step, stage: "review_injection", lessonPhase: "active_recall" },
            "vocab_recognition",
            "Review — choose the meaning.",
            input.hintPolicy,
          ),
        );
      }
    }
  }

  let bounded = trimBlockSteps(enforceExerciseVariety(scoredSteps));
  if (bounded.length < LESSON_MIN_SCORED_EXERCISES && allContents.length > 0) {
    const fallback = assembleStagedExerciseSteps({
      newContents: allContents,
      reviewContents: input.reviewContents,
      isCheckpoint: false,
    });
    bounded = fallback.steps.map((step) => applyHintPolicyToStep(step, input.hintPolicy));
  }

  const total = bounded.length;
  const indexed = bounded.map((step, index) => ({
    ...step,
    index: index + 1,
    total,
  }));

  return {
    steps: [...lessonSteps, ...indexed],
    registry,
  };
}

export function buildStagedInputFromBlocks(
  blocks: KnowledgeBlock[],
  reviewContents: LessonContent[],
): StagedLessonAssemblyInput {
  const newContents = blocks
    .filter((block) => block.isNew && block.sourceContent)
    .map((block) => block.sourceContent!)
    .filter(
      (content) =>
        content.type === "vocabulary" ||
        content.type === "kanji" ||
        content.type === "grammar" ||
        content.type === "hiragana" ||
        content.type === "katakana",
    );

  return {
    newContents,
    reviewContents,
    isCheckpoint: false,
  };
}
