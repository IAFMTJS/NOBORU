import { describe, expect, it } from "vitest";

import { resolveDifficultyProfile } from "@/lib/learning/difficulty-scaling.service";
import {
  applyDifficultyToChoiceOptions,
  recognitionTimerSeconds,
  resolveFuriganaReading,
  shouldShowDrillHints,
} from "@/lib/learning/drill-difficulty.utils";

describe("drill difficulty utils", () => {
  it("trims choice options while keeping the correct answer", () => {
    const { options, correctIndex } = applyDifficultyToChoiceOptions(
      ["correct", "d1", "d2", "d3"],
      0,
      2,
    );

    expect(options).toHaveLength(2);
    expect(options[correctIndex]).toBe("correct");
  });

  it("hides furigana when profile removes support", () => {
    const mastered = resolveDifficultyProfile("mastered");
    expect(
      resolveFuriganaReading({
        display: "食べる",
        reading: "たべる",
        profile: mastered,
      }),
    ).toBeNull();

    const discovered = resolveDifficultyProfile("discovered");
    expect(
      resolveFuriganaReading({
        display: "食べる",
        reading: "たべる",
        profile: discovered,
      }),
    ).toBe("たべる");
  });

  it("maps lifecycle profiles to hint and timer behavior", () => {
    const discovered = resolveDifficultyProfile("discovered");
    const reinforced = resolveDifficultyProfile("reinforced");

    expect(shouldShowDrillHints(discovered)).toBe(true);
    expect(shouldShowDrillHints(reinforced)).toBe(true);
    expect(recognitionTimerSeconds(discovered)).toBeNull();
    expect(recognitionTimerSeconds(reinforced)).toBe(20);
  });
});
