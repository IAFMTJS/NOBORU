import { describe, expect, it } from "vitest";

import { buildDailyChallengeSession } from "@/lib/learning/daily-challenge.service";
import type { PlayerKnowledgeContext } from "@/lib/learning/learning-architecture.types";

function context(
  overrides: Partial<PlayerKnowledgeContext> = {},
): PlayerKnowledgeContext {
  return {
    jlptLevel: "n5",
    unlockedBranchIds: [],
    unlockedChapterIds: [],
    knownVocabularyIds: ["a", "b", "c"],
    knownGrammarIds: [],
    knownKanjiIds: [],
    masteredVocabularyIds: ["c"],
    weakVocabularyIds: ["b"],
    activeVocabularyPool: ["a", "b", "c"],
    ...overrides,
  };
}

describe("buildDailyChallengeSession", () => {
  it("prioritizes recently learned and weak words for retention", () => {
    const session = buildDailyChallengeSession(
      context(),
      ["c"],
      10,
    );

    expect(session.goal).toBe("retention");
    expect(session.items[0]?.priority).toBe("recently_learned");
    expect(session.items.some((item) => item.priority === "forgotten")).toBe(true);
  });
});
