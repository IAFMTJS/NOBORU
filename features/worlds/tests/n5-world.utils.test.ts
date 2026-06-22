import { describe, expect, it } from "vitest";

import { resolveN5TrialDisplayTitle } from "@/features/worlds/constants/n5-trial-display.constants";
import { resolveWorldLandmarks } from "@/features/worlds/utils/world-landmarks.utils";

describe("world-landmarks.utils", () => {
  it("returns CMS landmarks when present", () => {
    const cms = [
      {
        id: "1",
        regionId: "r1",
        slug: "ember-threshold",
        label: "Ember Threshold",
        subtitle: null,
        kind: "shrine" as const,
        triggerAfterLessonCount: 1,
        pathPosition: 0.02,
        orderIndex: 0,
      },
    ];
    expect(resolveWorldLandmarks("n5", "r1", cms)).toEqual(cms);
  });

  it("materializes N5 fallbacks when CMS is empty", () => {
    const landmarks = resolveWorldLandmarks("n5", "region-n5", []);
    expect(landmarks.length).toBe(8);
    expect(landmarks[0]?.label).toBe("Ember Threshold");
  });

  it("does not fallback for other worlds", () => {
    expect(resolveWorldLandmarks("n4", "region-n4", [])).toEqual([]);
  });
});

describe("n5-trial-display.constants", () => {
  it("renames legacy trial titles for n5", () => {
    expect(resolveN5TrialDisplayTitle("Foothills Guardian", "n5")).toBe("Script Keeper");
    expect(resolveN5TrialDisplayTitle("Final N5 Trial", "mount-n5")).toBe(
      "Guardian of First Light",
    );
  });

  it("leaves titles unchanged for non-n5 regions", () => {
    expect(resolveN5TrialDisplayTitle("Foothills Guardian", "n4")).toBe("Foothills Guardian");
  });
});
