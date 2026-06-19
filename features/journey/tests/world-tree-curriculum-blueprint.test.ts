import { describe, expect, it } from "vitest";

import {
  REGION_SLOT_TARGETS,
  WORLD_TREE_BLUEPRINT_TOTAL_SLOTS,
  WORLD_TREE_CURRICULUM_BLUEPRINT,
  countBlueprintSlotsByRegion,
  resolveBlueprintSlot,
} from "@/features/journey/data/world-tree-curriculum-blueprint";

describe("world-tree-curriculum-blueprint", () => {
  it("defines unique slot ids", () => {
    const ids = WORLD_TREE_CURRICULUM_BLUEPRINT.map((slot) => slot.slotId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("matches per-region slot targets", () => {
    const counts = countBlueprintSlotsByRegion();

    for (const [regionSlug, target] of Object.entries(REGION_SLOT_TARGETS)) {
      expect(counts[regionSlug]).toBe(target);
    }
  });

  it("sums to the documented blueprint total", () => {
    const sum = Object.values(REGION_SLOT_TARGETS).reduce((a, b) => a + b, 0);
    expect(WORLD_TREE_BLUEPRINT_TOTAL_SLOTS).toBe(sum);
    expect(WORLD_TREE_BLUEPRINT_TOTAL_SLOTS).toBeGreaterThanOrEqual(600);
  });

  it("resolves slots by region index", () => {
    const slot = resolveBlueprintSlot("mount-n5", 0);
    expect(slot?.regionSlug).toBe("mount-n5");
    expect(slot?.kind).toBe("lesson");
  });
});
