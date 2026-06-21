import { describe, expect, it } from "vitest";

import {
  calculateLessonScore,
  getLessonPassScore,
  isLessonScorePassing,
} from "@/features/learning/constants/lesson.constants";

describe("lesson pass constants", () => {
  it("uses universal 90% pass score for all lesson types", () => {
    expect(getLessonPassScore("vocabulary")).toBe(90);
    expect(getLessonPassScore("practice")).toBe(90);
    expect(getLessonPassScore("application")).toBe(90);
  });

  it("calculates lesson score from recall totals", () => {
    expect(calculateLessonScore(9, 10)).toBe(90);
    expect(calculateLessonScore(0, 0)).toBe(100);
  });

  it("blocks first completion below the pass threshold", () => {
    expect(isLessonScorePassing("vocabulary", 89)).toBe(false);
    expect(isLessonScorePassing("vocabulary", 90)).toBe(true);
    expect(isLessonScorePassing("practice", 89)).toBe(false);
    expect(isLessonScorePassing("practice", 90)).toBe(true);
  });
});
