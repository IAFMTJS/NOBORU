import { describe, expect, it } from "vitest";

import { assembleStoryForPlayer } from "@/lib/learning/story-assembly.service";
import type { PlayerKnowledgeContext } from "@/lib/learning/learning-architecture.types";

const playerContext: PlayerKnowledgeContext = {
  jlptLevel: "n5",
  unlockedBranchIds: [],
  unlockedChapterIds: [],
  knownVocabularyIds: ["v-known"],
  knownGrammarIds: [],
  masteredVocabularyIds: ["v-known"],
  weakVocabularyIds: [],
  activeVocabularyPool: ["v-known"],
};

describe("assembleStoryForPlayer", () => {
  it("flags unknown vocabulary tokens for highlighting", () => {
    const lookup = new Map([
      ["v-known", { id: "v-known", surfaceForms: ["ありがとう"] }],
      ["v-new", { id: "v-new", surfaceForms: ["さようなら"] }],
    ]);

    const result = assembleStoryForPlayer(
      [{ id: "s1", japaneseText: "ありがとう。さようなら。" }],
      playerContext,
      lookup,
    );

    expect(result.highlightedVocabularyIds).toContain("v-new");
    expect(result.sections[0]?.annotations.some((a) => a.shouldHighlight)).toBe(
      true,
    );
  });
});
