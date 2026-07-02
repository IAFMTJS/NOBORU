import type { GrammarLessonContent, LessonContent } from "@/features/learning/types/lesson.types";
import {
  buildConceptFromContent,
  detectGrammarConceptKind,
  grammarConceptKindToConceptKind,
  isVerbVocabulary,
  learningLayersForConcept,
} from "@/lib/learning/knowledge-block/concept-detection";
import type {
  DecomposeLessonInput,
  GrammarConceptKind,
  KnowledgeBlock,
  KnowledgeConcept,
  ConceptKind,
} from "@/lib/learning/knowledge-block/types";

function sortContentsByPedagogyOrder(contents: LessonContent[]): LessonContent[] {
  const kindOrder: Record<string, number> = {
    hiragana: 0,
    katakana: 1,
    vocabulary: 2,
    kanji: 3,
    grammar: 4,
  };

  return [...contents].sort((left, right) => {
    const leftOrder = kindOrder[left.type] ?? 99;
    const rightOrder = kindOrder[right.type] ?? 99;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return 0;
  });
}

function grammarSortWeight(content: GrammarLessonContent): number {
  const kind = detectGrammarConceptKind(content);
  switch (kind) {
    case "particle":
      return 0;
    case "sentence_order":
      return 1;
    case "conjugation":
      return 2;
    default:
      return 3;
  }
}

function sortGrammarBlocks(blocks: KnowledgeBlock[]): KnowledgeBlock[] {
  const grammarBlocks = blocks.filter((block) => block.sourceContent?.type === "grammar");
  const nonGrammar = blocks.filter((block) => block.sourceContent?.type !== "grammar");

  grammarBlocks.sort((left, right) => {
    const leftGrammar = left.sourceContent as GrammarLessonContent;
    const rightGrammar = right.sourceContent as GrammarLessonContent;
    return grammarSortWeight(leftGrammar) - grammarSortWeight(rightGrammar);
  });

  const vocabAndKanji = nonGrammar.filter(
    (block) =>
      block.conceptKind === "vocabulary" ||
      block.conceptKind === "kanji" ||
      block.conceptKind === "kana",
  );
  const other = nonGrammar.filter(
    (block) =>
      block.conceptKind !== "vocabulary" &&
      block.conceptKind !== "kanji" &&
      block.conceptKind !== "kana",
  );

  return [...vocabAndKanji, ...grammarBlocks, ...other];
}

function buildAtomicBlock(
  content: LessonContent,
  orderIndex: number,
  isNew: boolean,
  allowedTestConceptIds: string[],
  grammarConceptKindOverride?: GrammarConceptKind | null,
): KnowledgeBlock {
  const concept = buildConceptFromContent(content, grammarConceptKindOverride);
  return {
    id: `block:${concept.id}`,
    phase: "practice",
    conceptKind: concept.conceptKind,
    sourceContent: content,
    concept,
    learningLayerSequence: learningLayersForConcept(concept.conceptKind),
    allowedTestConceptIds: [...allowedTestConceptIds, concept.id],
    orderIndex,
    isNew,
  };
}

function buildCombineBlock(
  contents: LessonContent[],
  concepts: KnowledgeConcept[],
  orderIndex: number,
): KnowledgeBlock | null {
  const sentenceContents = contents.filter(
    (content) =>
      (content.type === "vocabulary" || content.type === "grammar") &&
      content.examples.length > 0,
  );
  if (sentenceContents.length === 0) return null;

  const anchor = sentenceContents[0]!;
  const concept: KnowledgeConcept = {
    id: `combine:${anchor.id}`,
    contentType: anchor.type === "grammar" || anchor.type === "vocabulary" ? anchor.type : "vocabulary",
    contentId: anchor.id,
    conceptKind: "combine",
    surface:
      anchor.type === "vocabulary"
        ? anchor.kanji ?? anchor.kana
        : anchor.type === "grammar"
          ? anchor.title
          : "",
    meaning:
      anchor.type === "vocabulary"
        ? anchor.meaning
        : anchor.type === "grammar"
          ? anchor.meaning
          : null,
  };

  return {
    id: `block:${concept.id}`,
    phase: "combine",
    conceptKind: "combine",
    sourceContent: anchor,
    concept,
    learningLayerSequence: learningLayersForConcept("combine"),
    allowedTestConceptIds: concepts.map((item) => item.id),
    orderIndex,
    isNew: false,
  };
}

export function decomposeLessonIntoBlocks(input: DecomposeLessonInput): KnowledgeBlock[] {
  const { contents, knownContentIds } = input;
  const ordered = sortContentsByPedagogyOrder(contents);
  const blocks: KnowledgeBlock[] = [];
  const introducedConcepts: KnowledgeConcept[] = [];
  let orderIndex = 0;

  for (const content of ordered) {
    const conceptId = `${content.type}:${content.id}`;
    const isNew = !knownContentIds.has(conceptId) && !knownContentIds.has(content.id);
    const priorIds = introducedConcepts.map((concept) => concept.id);

    if (content.type === "grammar") {
      const grammarKind = detectGrammarConceptKind(content);
      const block = buildAtomicBlock(content, orderIndex, isNew, priorIds);
      block.phase = "teach";
      blocks.push(block);
      introducedConcepts.push(block.concept);
      orderIndex += 1;
      continue;
    }

    if (content.type === "vocabulary" && isVerbVocabulary(content)) {
      const block = buildAtomicBlock(content, orderIndex, isNew, priorIds);
      block.phase = "teach";
      blocks.push(block);
      introducedConcepts.push(block.concept);
      orderIndex += 1;
      continue;
    }

    const block = buildAtomicBlock(content, orderIndex, isNew, priorIds);
    block.phase = "teach";
    blocks.push(block);
    introducedConcepts.push(block.concept);
    orderIndex += 1;
  }

  const sorted = sortGrammarBlocks(blocks);
  const combine = buildCombineBlock(ordered, introducedConcepts, sorted.length);
  if (combine) {
    sorted.push(combine);
  }

  const masteryBlock: KnowledgeBlock = {
    id: "block:mastery",
    phase: "mastery",
    conceptKind: "combine",
    sourceContent: null,
    concept: {
      id: "mastery:lesson",
      contentType: "vocabulary",
      contentId: "mastery",
      conceptKind: "combine",
      surface: "Mastery check",
      meaning: "Combine everything you learned",
    },
    learningLayerSequence: ["sentence_comprehension", "production"],
    allowedTestConceptIds: introducedConcepts.map((concept) => concept.id),
    orderIndex: sorted.length,
    isNew: false,
  };
  sorted.push(masteryBlock);

  return sorted.map((block, index) => ({ ...block, orderIndex: index }));
}

export function getGrammarConceptKindForContent(
  content: LessonContent,
  conceptKindOverride?: GrammarConceptKind | null,
): ConceptKind | null {
  if (content.type !== "grammar") return null;
  return grammarConceptKindToConceptKind(
    detectGrammarConceptKind(content, conceptKindOverride),
  );
}
