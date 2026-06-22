import { describe, expect, it } from "vitest";

import {
  LEGACY_REGION_TO_WORLD,
  normalizeRegionSlug,
  N5_ACTS,
} from "@/lib/design-system/worlds";

describe("worlds", () => {
  it("normalizes legacy region slugs to world slugs", () => {
    expect(normalizeRegionSlug("foothills")).toBe("n5");
    expect(normalizeRegionSlug("mount-n4")).toBe("n4");
    expect(normalizeRegionSlug("n3")).toBe("n3");
  });

  it("maps all legacy slugs to a world", () => {
    for (const legacy of Object.keys(LEGACY_REGION_TO_WORLD)) {
      expect(normalizeRegionSlug(legacy)).toMatch(/^n[1-5]$/);
    }
  });

  it("defines three N5 acts", () => {
    expect(N5_ACTS[1].subtitle).toBe("Awakening");
    expect(N5_ACTS[3].subtitle).toBe("The climb begins");
  });
});
