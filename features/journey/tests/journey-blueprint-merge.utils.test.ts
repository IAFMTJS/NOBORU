import { describe, expect, it } from "vitest";

import { WORLD_TREE_BLUEPRINT_TOTAL_SLOTS } from "@/features/journey/data/world-tree-curriculum-blueprint";
import { buildJourneyPathFromData } from "@/features/journey/services/journey.service";
import { augmentRegionsWithBlueprint } from "@/features/journey/utils/journey-blueprint-merge.utils";
import { buildWorldTreeLayout } from "@/features/journey/utils/world-tree-layout.utils";
import type { RegionPathViewModel } from "@/features/learning/types/lesson.types";

function makeCmsRegion(
  slug: string,
  lessonCount: number,
  branchCount = 1,
): RegionPathViewModel {
  const lessonsPerBranch = Math.ceil(lessonCount / branchCount);

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
    units: Array.from({ length: branchCount }, (_, branchIndex) => {
      const branchLessons = Math.min(
        lessonsPerBranch,
        lessonCount - branchIndex * lessonsPerBranch,
      );

      return {
        id: `unit-${slug}-${branchIndex}`,
        name: `Branch ${branchIndex + 1}`,
        description: null,
        orderIndex: branchIndex,
        lessonCount: branchLessons,
        completedCount: 0,
        lessons: Array.from({ length: branchLessons }, (_, index) => ({
          id: `${slug}-b${branchIndex}-lesson-${index}`,
          unitId: `unit-${slug}-${branchIndex}`,
          type: "vocabulary",
          title: `Lesson ${index + 1}`,
          description: null,
          xpReward: 10,
          estimatedDuration: 5,
          progress: "not_started" as const,
          score: 0,
          contentStatus: "published" as const,
        })),
      };
    }),
  };
}

describe("augmentRegionsWithBlueprint", () => {
  it("creates all 8 canonical regions even when CMS only has a subset", () => {
    const cmsRegions = [
      makeCmsRegion("foothills", 20),
      makeCmsRegion("mount-n5", 35, 3),
    ];

    const augmented = augmentRegionsWithBlueprint(cmsRegions, new Set());

    expect(augmented).toHaveLength(8);
    expect(augmented.find((region) => region.slug === "mount-n3")).toBeDefined();
    expect(augmented.find((region) => region.slug === "mount-n1")).toBeDefined();
  });

  it("pads regions to blueprint slot targets with virtual draft lessons", () => {
    const augmented = augmentRegionsWithBlueprint(
      [makeCmsRegion("mount-n5", 35, 3)],
      new Set(),
    );
    const n5 = augmented.find((region) => region.slug === "mount-n5")!;

    expect(n5.lessonCount).toBe(95);
    expect(n5.units.flatMap((unit) => unit.lessons).some((lesson) => lesson.id.startsWith("blueprint:"))).toBe(
      true,
    );
  });

  it("produces the full blueprint lesson count across all regions", () => {
    const augmented = augmentRegionsWithBlueprint([], new Set());
    const totalLessons = augmented.reduce((sum, region) => sum + region.lessonCount, 0);

    expect(totalLessons).toBe(WORLD_TREE_BLUEPRINT_TOTAL_SLOTS);
  });

  it("attaches blueprint metadata to every merged lesson", () => {
    const augmented = augmentRegionsWithBlueprint([makeCmsRegion("mount-n5", 10, 2)], new Set());
    const n5 = augmented.find((region) => region.slug === "mount-n5")!;
    const lessons = n5.units.flatMap((unit) => unit.lessons);

    expect(lessons.every((lesson) => lesson.blueprint?.slotId)).toBe(true);
    expect(lessons.every((lesson) => lesson.blueprint?.branchId)).toBe(true);
  });

  it("maps CMS branch units onto blueprint branches instead of flat index only", () => {
    const cms = makeCmsRegion("mount-n4", 16, 4);
    const augmented = augmentRegionsWithBlueprint([cms], new Set());
    const n4 = augmented.find((region) => region.slug === "mount-n4")!;

    const firstBranchFirstLesson = n4.units[0]?.lessons[0];
    expect(firstBranchFirstLesson?.id).toBe("mount-n4-b0-lesson-0");
    expect(firstBranchFirstLesson?.blueprint?.branchIndex).toBe(0);
  });

  it("does not assign the same CMS lesson id to multiple blueprint slots", () => {
    const cmsRegions = [
      makeCmsRegion("foothills", 20),
      makeCmsRegion("mount-n5", 35, 3),
    ];
    const augmented = augmentRegionsWithBlueprint(cmsRegions, new Set());
    const cmsLessonIds = augmented.flatMap((region) =>
      region.units.flatMap((unit) =>
        unit.lessons
          .map((lesson) => lesson.id)
          .filter((id) => !id.startsWith("blueprint:")),
      ),
    );

    expect(new Set(cmsLessonIds).size).toBe(cmsLessonIds.length);
  });
});

describe("blueprint-driven journey path", () => {
  it("builds a full tree with blueprint metadata on nodes and layout", () => {
    const augmented = augmentRegionsWithBlueprint([], new Set());
    const journey = buildJourneyPathFromData(augmented, [], new Set());
    const lessonNodes = journey.regions.flatMap((region) =>
      region.nodes.filter(
        (node) => node.kind === "lesson" || node.kind === "checkpoint" || node.kind === "trial",
      ),
    );
    const layout = buildWorldTreeLayout(journey);

    expect(lessonNodes.length).toBe(WORLD_TREE_BLUEPRINT_TOTAL_SLOTS);
    expect(lessonNodes.every((node) => node.blueprint?.slotId)).toBe(true);
    expect(new Set(lessonNodes.map((node) => node.id)).size).toBe(lessonNodes.length);
    expect(layout.nodes.length).toBeGreaterThanOrEqual(WORLD_TREE_BLUEPRINT_TOTAL_SLOTS);

    const zonesUsed = new Set(layout.nodes.map((node) => node.zoneId));
    expect(zonesUsed.has("deep_roots")).toBe(true);
    expect(zonesUsed.has("n1_celestial")).toBe(true);
  });
});
