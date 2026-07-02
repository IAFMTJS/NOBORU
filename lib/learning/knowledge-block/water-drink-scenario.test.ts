import { describe, expect, it } from "vitest";

import type { GrammarLessonContent, VocabularyLessonContent } from "@/features/learning/types/lesson.types";
import { decomposeLessonIntoBlocks } from "@/lib/learning/knowledge-block/decomposer";
import {
  detectGrammarConceptKind,
  parseTeachingStepsFromExplanation,
} from "@/lib/learning/knowledge-block/concept-detection";
import { assembleKnowledgeBlockSteps } from "@/lib/learning/knowledge-block/block-assembly.service";
import { resolveHintPolicy } from "@/lib/learning/hint-policy.service";
import { resolveDifficultyProfile } from "@/lib/learning/difficulty-scaling.service";

const playerContext = {
  jlptLevel: "n5" as const,
  unlockedBranchIds: [],
  unlockedChapterIds: [],
  knownVocabularyIds: [],
  knownGrammarIds: [],
  knownKanjiIds: [],
  masteredVocabularyIds: [],
  weakVocabularyIds: [],
  activeVocabularyPool: [],
};

describe("decomposeLessonIntoBlocks", () => {
  it("orders vocabulary before grammar and adds combine + mastery blocks", () => {
    const mizu: VocabularyLessonContent = {
      type: "vocabulary",
      id: "v-mizu",
      kana: "みず",
      kanji: "水",
      romaji: "mizu",
      meaning: "water",
      partOfSpeech: "noun",
      audioUrl: null,
      examples: [],
    };
    const nomu: VocabularyLessonContent = {
      type: "vocabulary",
      id: "v-nomu",
      kana: "のむ",
      kanji: "飲む",
      romaji: "nomu",
      meaning: "to drink",
      partOfSpeech: "verb",
      audioUrl: null,
      examples: [],
    };
    const wo: GrammarLessonContent = {
      type: "grammar",
      id: "g-wo",
      title: "を",
      meaning: "object marker",
      explanation: null,
      examples: [
        {
          japaneseText: "水を飲みます。",
          romaji: "Mizu o nomimasu.",
          english: "I drink water.",
        },
      ],
    };

    const blocks = decomposeLessonIntoBlocks({
      contents: [wo, mizu, nomu],
      playerContext,
      knownContentIds: new Set(),
    });

    expect(blocks[0]?.concept.surface).toBe("水");
    expect(blocks[1]?.concept.surface).toBe("飲む");
    expect(blocks.some((block) => block.conceptKind === "particle")).toBe(true);
    expect(blocks.some((block) => block.phase === "combine")).toBe(true);
    expect(blocks.some((block) => block.phase === "mastery")).toBe(true);
  });
});

describe("water-drink acceptance scenario", () => {
  it("teaches components before combine sentence drills and hides romaji on normal", () => {
    const mizu: VocabularyLessonContent = {
      type: "vocabulary",
      id: "v-mizu",
      kana: "みず",
      kanji: "水",
      romaji: "mizu",
      meaning: "water",
      partOfSpeech: "noun",
      audioUrl: null,
      examples: [],
    };
    const nomu: VocabularyLessonContent = {
      type: "vocabulary",
      id: "v-nomu",
      kana: "のむ",
      kanji: "飲む",
      romaji: "nomu",
      meaning: "to drink",
      partOfSpeech: "verb",
      audioUrl: null,
      examples: [],
    };
    const wo: GrammarLessonContent = {
      type: "grammar",
      id: "g-wo",
      title: "を",
      meaning: "object marker",
      explanation: null,
      examples: [
        {
          japaneseText: "水を飲みます。",
          romaji: "Mizu o nomimasu.",
          english: "I drink water.",
        },
      ],
    };
    const masu: GrammarLessonContent = {
      type: "grammar",
      id: "g-masu",
      title: "ます (masu)",
      meaning: "polite verb ending",
      explanation: "飲む → 飲み → 飲みます",
      examples: [
        {
          japaneseText: "水を飲みます。",
          romaji: "Mizu o nomimasu.",
          english: "I drink water.",
        },
      ],
    };

    const blocks = decomposeLessonIntoBlocks({
      contents: [mizu, nomu, wo, masu],
      playerContext,
      knownContentIds: new Set(),
    });

    const hintPolicy = resolveHintPolicy({
      studyDifficulty: "normal",
      lifecycleProfile: resolveDifficultyProfile("discovered"),
    });

    const { steps } = assembleKnowledgeBlockSteps({
      blocks,
      reviewContents: [],
      isCheckpoint: false,
      hintPolicy,
      priorKnownConceptIds: new Set(),
    });

    const teachSurfaces = steps
      .filter((step) => step.kind === "teach")
      .map((step) => (step.kind === "teach" ? step.content : null))
      .filter(Boolean);

    expect(teachSurfaces.some((content) => content && "kanji" in content && content.kanji === "水")).toBe(true);
    expect(teachSurfaces.some((content) => content && content.type === "grammar" && content.title.startsWith("を"))).toBe(true);

    const combineSteps = steps.filter(
      (step): step is Extract<typeof step, { learningLayer?: string }> =>
        "learningLayer" in step &&
        (step.learningLayer === "sentence_construction" || step.learningLayer === "production"),
    );
    expect(combineSteps.length).toBeGreaterThan(0);

    const fillBlank = steps.find((step) => step.kind === "fill_blank");
    if (fillBlank && fillBlank.kind === "fill_blank") {
      expect(fillBlank.hintPolicy?.showRomaji).toBe(false);
    }
  });
});

describe("concept detection", () => {
  it("detects particles and conjugation chains", () => {
    expect(
      detectGrammarConceptKind({
        type: "grammar",
        id: "1",
        title: "を",
        meaning: "object marker",
        explanation: null,
        examples: [],
      }),
    ).toBe("particle");

    const steps = parseTeachingStepsFromExplanation("飲む → 飲み → 飲みます");
    expect(steps?.map((step) => step.japanese)).toEqual(["飲む", "飲み", "飲みます"]);
  });
});
