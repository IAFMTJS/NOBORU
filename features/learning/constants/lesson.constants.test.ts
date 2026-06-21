import { describe, expect, it } from "vitest";

import {
  calculateLessonScore,
  getLessonPassScore,
  isLessonScorePassing,
} from "@/features/learning/constants/lesson.constants";

describe("lesson pass constants", () => {
  it("uses universal 80% pass score for all lesson types", () => {
    expect(getLessonPassScore("vocabulary")).toBe(80);
    expect(getLessonPassScore("practice")).toBe(80);
    expect(getLessonPassScore("application")).toBe(80);
  });

  it("calculates lesson score from recall totals", () => {
    expect(calculateLessonScore(8, 10)).toBe(80);
    expect(calculateLessonScore(0, 0)).toBe(100);
  });

  it("blocks first completion below the pass threshold", () => {
    expect(isLessonScorePassing("vocabulary", 79)).toBe(false);
    expect(isLessonScorePassing("vocabulary", 80)).toBe(true);
    expect(isLessonScorePassing("practice", 79)).toBe(false);
    expect(isLessonScorePassing("practice", 80)).toBe(true);
  });
});
