import { describe, expect, it } from "vitest";

import {
  buildLearningBranchSlug,
  resolveThematicCategorySlugForUnitName,
} from "@/lib/learning/world-tree-branch.utils";

describe("world tree branch utils", () => {
  it("maps unit names to bible thematic categories", () => {
    expect(resolveThematicCategorySlugForUnitName("Family & Body")).toBe("family");
    expect(resolveThematicCategorySlugForUnitName("Food & Drink")).toBe("food");
    expect(resolveThematicCategorySlugForUnitName("Travel Basics")).toBe("travel");
    expect(resolveThematicCategorySlugForUnitName("Grammar Review")).toBe(
      "daily-activities",
    );
  });

  it("builds stable branch slugs from region and unit names", () => {
    expect(buildLearningBranchSlug("mount-n5", "People & Places")).toBe(
      "mount-n5-people-places",
    );
  });
});
