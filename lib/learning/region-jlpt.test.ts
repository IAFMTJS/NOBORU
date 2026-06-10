import { describe, expect, it } from "vitest";

import { getJlptLevelForRegion } from "@/lib/learning/region-jlpt";

describe("getJlptLevelForRegion", () => {
  it("maps known regions to JLPT levels", () => {
    expect(getJlptLevelForRegion("mount-n5")).toBe("n5");
    expect(getJlptLevelForRegion("mount-n4")).toBe("n4");
  });

  it("defaults unknown regions to n5", () => {
    expect(getJlptLevelForRegion("unknown-region")).toBe("n5");
  });
});
