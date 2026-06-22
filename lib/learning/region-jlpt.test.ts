import { describe, expect, it } from "vitest";

import { getJlptLevelForRegion } from "@/lib/learning/region-jlpt";

describe("getJlptLevelForRegion", () => {
  it("maps world slugs to JLPT levels", () => {
    expect(getJlptLevelForRegion("n5")).toBe("n5");
    expect(getJlptLevelForRegion("n4")).toBe("n4");
  });

  it("normalizes legacy region slugs", () => {
    expect(getJlptLevelForRegion("mount-n5")).toBe("n5");
    expect(getJlptLevelForRegion("foothills")).toBe("n5");
  });

  it("defaults unknown regions to n5", () => {
    expect(getJlptLevelForRegion("unknown-region")).toBe("n5");
  });
});
