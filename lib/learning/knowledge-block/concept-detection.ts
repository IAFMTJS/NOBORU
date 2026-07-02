import type { GrammarLessonContent, LessonContent, VocabularyLessonContent } from "@/features/learning/types/lesson.types";
import type { ConceptKind, GrammarConceptKind, KnowledgeConcept, TeachingStep } from "@/lib/learning/knowledge-block/types";

const PARTICLE_PATTERN =
  /^(は|が|を|に|で|の|と|も|へ|から|まで|より|か|ね|よ|な|ので|のに|けど|が|ば)$/;

const CONJUGATION_KEYWORDS =
  /ます|ません|ましょう|て-form|た-form|ない|stem|dictionary|polite|past|negative|potential|passive|causative|ている|てる|たい|conditional/i;

const SENTENCE_ORDER_KEYWORDS = /word order|sentence order|arrange|order/i;

export function detectGrammarConceptKind(
  grammar: GrammarLessonContent,
  conceptKindOverride?: GrammarConceptKind | null,
): GrammarConceptKind {
  if (conceptKindOverride) return conceptKindOverride;

  const title = grammar.title.trim();
  const bareParticle = title.replace(/\s*\([^)]*\)\s*$/, "").trim();

  if (PARTICLE_PATTERN.test(bareParticle) || PARTICLE_PATTERN.test(title)) {
    return "particle";
  }

  const haystack = `${grammar.title} ${grammar.meaning} ${grammar.explanation ?? ""}`;
  if (CONJUGATION_KEYWORDS.test(haystack)) {
    return "conjugation";
  }

  if (SENTENCE_ORDER_KEYWORDS.test(haystack)) {
    return "sentence_order";
  }

  return "pattern";
}

export function grammarConceptKindToConceptKind(kind: GrammarConceptKind): ConceptKind {
  switch (kind) {
    case "particle":
      return "particle";
    case "conjugation":
      return "conjugation";
    case "sentence_order":
      return "sentence_order";
    default:
      return "grammar_pattern";
  }
}

export function isVerbVocabulary(content: VocabularyLessonContent): boolean {
  const pos = content.partOfSpeech?.toLowerCase() ?? "";
  return pos.includes("verb") || pos.includes("v.");
}

export function parseTeachingStepsFromExplanation(
  explanation: string | null | undefined,
): TeachingStep[] | undefined {
  if (!explanation) return undefined;

  try {
    const parsed = JSON.parse(explanation) as unknown;
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (item) =>
          item &&
          typeof item === "object" &&
          "label" in item &&
          "japanese" in item,
      )
    ) {
      return parsed as TeachingStep[];
    }
  } catch {
    // fall through to arrow-chain parsing
  }

  const arrowMatch = explanation.match(/(.+?)\s*→\s*(.+?)(?:\s*→\s*(.+))?/);
  if (!arrowMatch) return undefined;

  const steps: TeachingStep[] = [];
  const parts = explanation.split("→").map((part) => part.trim()).filter(Boolean);
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index]!;
    steps.push({
      label: index === 0 ? "Dictionary form" : index === parts.length - 1 ? "Target form" : "Stem",
      japanese: part,
    });
  }
  return steps.length >= 2 ? steps : undefined;
}

export function buildConceptFromContent(
  content: LessonContent,
  grammarConceptKindOverride?: GrammarConceptKind | null,
): KnowledgeConcept {
  switch (content.type) {
    case "vocabulary":
      return {
        id: `vocabulary:${content.id}`,
        contentType: "vocabulary",
        contentId: content.id,
        conceptKind: "vocabulary",
        surface: content.kanji ?? content.kana,
        meaning: content.meaning,
      };
    case "kanji":
      return {
        id: `kanji:${content.id}`,
        contentType: "kanji",
        contentId: content.id,
        conceptKind: "kanji",
        surface: content.character,
        meaning: content.meaning,
      };
    case "grammar": {
      const grammarKind = detectGrammarConceptKind(
        content,
        grammarConceptKindOverride ?? content.conceptKind ?? null,
      );
      return {
        id: `grammar:${content.id}`,
        contentType: "grammar",
        contentId: content.id,
        conceptKind: grammarConceptKindToConceptKind(grammarKind),
        surface: content.title,
        meaning: content.meaning,
        teachingSteps:
          content.teachingSteps ??
          parseTeachingStepsFromExplanation(content.explanation),
      };
    }
    case "hiragana":
    case "katakana":
      return {
        id: `${content.type}:${content.id}`,
        contentType: content.type,
        contentId: content.id,
        conceptKind: "kana",
        surface: content.character,
        meaning: content.romaji,
      };
    default:
      return {
        id: `${content.type}:${content.id}`,
        contentType: content.type,
        contentId: content.id,
        conceptKind: "vocabulary",
        surface: "",
        meaning: null,
      };
  }
}

export function learningLayersForConcept(conceptKind: ConceptKind): import("@/lib/learning/knowledge-block/types").LearningLayer[] {
  switch (conceptKind) {
    case "vocabulary":
      return ["vocab_recognition", "vocab_recall", "listening"];
    case "kanji":
      return ["vocab_recognition", "reading", "vocab_recall"];
    case "kana":
      return ["vocab_recognition", "vocab_recall"];
    case "particle":
      return ["grammar"];
    case "conjugation":
      return ["conjugation"];
    case "sentence_order":
      return ["sentence_construction"];
    case "grammar_pattern":
      return ["grammar", "sentence_comprehension"];
    case "combine":
      return ["sentence_construction", "sentence_comprehension", "production"];
    default:
      return ["vocab_recognition"];
  }
}
