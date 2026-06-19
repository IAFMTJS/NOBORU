import { describe, expect, it } from "vitest";

import { WORLD_TREE_BLUEPRINT_TOTAL_SLOTS } from "@/features/journey/data/world-tree-curriculum-blueprint";
import { augmentRegionsWithBlueprint } from "@/features/journey/utils/journey-blueprint-merge.utils";
import type { RegionPathViewModel } from "@/features/learning/types/lesson.types";

function makeCmsRegion(
  slug: string,
  lessonCount: number,
): RegionPathViewModel {
  return {
    id: `region-${slug}`,
    slug,
    name: slug,
    description: null,
    lessonCount,
    completedCount: 0,
    progressPercent: 0,
    availability: "available",
    lockReason: null,
    units: [
      {
        id: `unit-${slug}`,
        name: "Unit 1",
        description: null,
        orderIndex: 0,
        lessonCount,
        completedCount: 0,
        lessons: Array.from({ length: lessonCount }, (_, index) => ({
          id: `${slug}-lesson-${index}`,
          unitId: `unit-${slug}`,
          type: "vocabulary",
          title: `Lesson ${index + 1}`,
          description: null,
          xpReward: 10,
          estimatedDuration: 5,
          progress: "not_started" as const,
          score: 0,
          contentStatus: "published" as const,
        })),
      },
    ],
  };
}

describe("augmentRegionsWithBlueprint", () => {
  it("creates all 8 canonical regions even when CMS only has a subset", () => {
    const cmsRegions = [
      makeCmsRegion("foothills", 20),
      makeCmsRegion("mount-n5", 35),
    ];

    const augmented = augmentRegionsWithBlueprint(cmsRegions, new Set());

    expect(augmented).toHaveLength(8);
    expect(augmented.find((region) => region.slug === "mount-n3")).toBeDefined();
    expect(augmented.find((region) => region.slug === "mount-n1")).toBeDefined();
  });

  it("pads regions to blueprint slot targets with virtual draft lessons", () => {
    const augmented = augmentRegionsWithBlueprint(
      [makeCmsRegion("mount-n5", 35)],
      new Set(),
    );
    const n5 = augmented.find((region) => region.slug === "mount-n5")!;

    expect(n5.lessonCount).toBe(95);
    expect(n5.units.flatMap((unit) => unit.lessons).some((lesson) => lesson.id.startsWith("blueprint:"))).toBe(
      true,
    );
  });

  it("produces roughly the full blueprint node count across all regions", () => {
    const augmented = augmentRegionsWithBlueprint([], new Set());
    const totalLessons = augmented.reduce((sum, region) => sum + region.lessonCount, 0);

    expect(totalLessons).toBe(WORLD_TREE_BLUEPRINT_TOTAL_SLOTS);
  });
});
