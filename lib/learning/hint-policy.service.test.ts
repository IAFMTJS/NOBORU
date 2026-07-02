import { describe, expect, it } from "vitest";

import { resolveHintPolicy, shouldRevealRomaji } from "@/lib/learning/hint-policy.service";
import { resolveDifficultyProfile } from "@/lib/learning/difficulty-scaling.service";

describe("hint policy", () => {
  it("hides romaji on normal until revealed", () => {
    const policy = resolveHintPolicy({
      studyDifficulty: "normal",
      lifecycleProfile: resolveDifficultyProfile("discovered"),
    });

    expect(policy.showRomaji).toBe(false);
    expect(policy.romajiOnDemand).toBe(true);
    expect(shouldRevealRomaji(policy, false, false)).toBe(false);
    expect(shouldRevealRomaji(policy, true, false)).toBe(true);
  });

  it("shows romaji on easy", () => {
    const policy = resolveHintPolicy({
      studyDifficulty: "easy",
      lifecycleProfile: resolveDifficultyProfile("discovered"),
    });
    expect(policy.showRomaji).toBe(true);
    expect(policy.showTranslation).toBe(true);
  });

  it("hides translation on hard", () => {
    const policy = resolveHintPolicy({
      studyDifficulty: "hard",
      lifecycleProfile: resolveDifficultyProfile("mastered"),
    });
    expect(policy.showTranslation).toBe(false);
    expect(policy.showFurigana).toBe(false);
  });
});
