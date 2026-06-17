import { describe, expect, it } from "vitest";

import {
  evaluateWordMastery,
  mapReviewStateToLifecycleStage,
} from "@/lib/learning/vocabulary-lifecycle";

describe("vocabulary lifecycle", () => {
  it("maps SRS states to bible lifecycle stages", () => {
    expect(mapReviewStateToLifecycleStage("new")).toBe("unknown");
    expect(mapReviewStateToLifecycleStage("learning")).toBe("discovered");
    expect(mapReviewStateToLifecycleStage("good")).toBe("recognized");
    expect(mapReviewStateToLifecycleStage("strong")).toBe("applied");
    expect(mapReviewStateToLifecycleStage("mastered")).toBe("mastered");
    expect(mapReviewStateToLifecycleStage("legendary")).toBe("maintained");
  });

  it("evaluates bible mastery requirements", () => {
    const complete = evaluateWordMastery({
      correctAnswerCount: 15,
      distinctExerciseTypes: 2,
      distinctSessionCount: 2,
      distinctDayCount: 2,
    });
    expect(complete.meetsBibleRequirements).toBe(true);
    expect(complete.lifecycleStage).toBe("mastered");
    expect(complete.gaps).toEqual([]);

    const incomplete = evaluateWordMastery({
      correctAnswerCount: 5,
      distinctExerciseTypes: 1,
      distinctSessionCount: 1,
      distinctDayCount: 1,
    });
    expect(incomplete.meetsBibleRequirements).toBe(false);
    expect(incomplete.gaps.length).toBeGreaterThan(0);
    expect(incomplete.lifecycleStage).toBe("reinforced");
  });
});
