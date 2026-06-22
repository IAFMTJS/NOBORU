import { describe, expect, it } from "vitest";

import {
  buildReviewRecommendations,
  computeTrialEpReward,
  computeTrialGrade,
} from "@/features/trials/constants/trial.constants";

describe("trial.constants", () => {
  it("computes grades from score thresholds", () => {
    expect(computeTrialGrade(70, true)).toBe("pass");
    expect(computeTrialGrade(85, true)).toBe("excellent");
    expect(computeTrialGrade(92, true)).toBe("perfect");
    expect(computeTrialGrade(97, true)).toBe("mastery");
    expect(computeTrialGrade(100, true)).toBe("legendary");
    expect(computeTrialGrade(100, false)).toBeNull();
  });

  it("applies grade multipliers on first pass only", () => {
    expect(computeTrialEpReward(100, "pass", true)).toBe(100);
    expect(computeTrialEpReward(100, "perfect", true)).toBe(130);
    expect(computeTrialEpReward(100, "legendary", true)).toBe(200);
    expect(computeTrialEpReward(100, "legendary", false)).toBe(0);
  });

  it("includes mount-n4 review recommendations", () => {
    const recommendations = buildReviewRecommendations(65, "n4");

    expect(recommendations.some((entry) => entry.includes("N4 vocabulary"))).toBe(
      true,
    );
    expect(
      recommendations.some((entry) => entry.includes("N4 reading and listening")),
    ).toBe(true);
  });
});
