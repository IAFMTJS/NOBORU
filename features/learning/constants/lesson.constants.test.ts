import { describe, expect, it } from "vitest";

import {
  calculateLessonScore,
  getLessonPassScore,
  isLessonScorePassing,
} from "@/features/learning/constants/lesson.constants";

describe("lesson pass constants", () => {
  it("uses tiered pass scores by lesson type", () => {
    expect(getLessonPassScore("vocabulary")).toBe(70);
    expect(getLessonPassScore("practice")).toBe(80);
    expect(getLessonPassScore("application")).toBe(75);
  });

  it("calculates lesson score from recall totals", () => {
    expect(calculateLessonScore(7, 10)).toBe(70);
    expect(calculateLessonScore(0, 0)).toBe(100);
  });

  it("blocks first completion below the pass threshold", () => {
    expect(isLessonScorePassing("vocabulary", 69)).toBe(false);
    expect(isLessonScorePassing("vocabulary", 70)).toBe(true);
    expect(isLessonScorePassing("practice", 79)).toBe(false);
    expect(isLessonScorePassing("practice", 80)).toBe(true);
  });
});
