import { describe, expect, it } from "vitest";

import {
  getJlptWorldDefinition,
  getNextWorld,
  getWorldHref,
  isRegisteredJlptWorld,
  JLPT_WORLD_REGISTRY,
  resolveWorldForRegionSlug,
} from "@/features/worlds/constants/world-registry.constants";
import { filterJourneyPathForWorld } from "@/features/worlds/utils/world-path-filter.utils";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";

function buildMinimalJourney(
  regionSlugs: string[],
): JourneyPathViewModel {
  return {
    regions: regionSlugs.map((slug, index) => ({
      id: `region-${slug}`,
      slug,
      name: slug,
      description: null,
      availability: "available",
      lockReason: null,
      lessonCount: 1,
      completedCount: 0,
      progressPercent: 0,
      currentNodeIndex: 0,
      nodes: [
        {
          id: `${slug}-node-1`,
          lessonId: `${slug}-lesson-1`,
          kind: "lesson",
          label: "Lesson",
          subtitle: null,
          lessonType: "vocabulary",
          state: index === 0 ? "available" : "locked",
          pathPosition: 0,
          regionIndex: 0,
          globalIndex: index,
          href: `/learn/lesson/${slug}-lesson-1`,
          xpReward: 10,
        },
      ],
    })),
    position: {
      currentRegionSlug: regionSlugs[0] ?? "foothills",
      currentRegionIndex: 0,
      currentLessonId: `${regionSlugs[0]}-lesson-1`,
      currentNodeId: `${regionSlugs[0]}-node-1`,
      globalNodeIndex: 0,
      globalLessonIndex: 0,
      pathPosition: 0,
    },
    nextLessonId: `${regionSlugs[0]}-lesson-1`,
    nextLessonHref: `/learn/lesson/${regionSlugs[0]}-lesson-1`,
  };
}

describe("world registry", () => {
  it("registers five JLPT worlds in ascent order", () => {
    expect(JLPT_WORLD_REGISTRY.map((world) => world.id)).toEqual([
      "n5",
      "n4",
      "n3",
      "n2",
      "n1",
    ]);
  });

  it("maps regions to their JLPT world", () => {
    expect(resolveWorldForRegionSlug("foothills")?.id).toBe("n5");
    expect(resolveWorldForRegionSlug("mount-n4")?.id).toBe("n4");
    expect(resolveWorldForRegionSlug("master-summit")?.id).toBe("n1");
  });

  it("chains worlds through portal nextWorldId", () => {
    expect(getNextWorld("n5")?.id).toBe("n4");
    expect(getNextWorld("n1")).toBeNull();
  });

  it("builds world hrefs", () => {
    expect(getWorldHref("n3")).toBe("/worlds/n3");
    expect(isRegisteredJlptWorld("n3")).toBe(true);
    expect(isRegisteredJlptWorld("n6")).toBe(false);
  });
});

describe("filterJourneyPathForWorld", () => {
  it("filters regions to a single JLPT world", () => {
    const journey = buildMinimalJourney([
      "foothills",
      "mount-n4",
      "mount-n2",
    ]);
    const n5World = getJlptWorldDefinition("n5");
    const worldPath = filterJourneyPathForWorld(journey, n5World);

    expect(worldPath.journey.regions.map((region) => region.slug)).toEqual([
      "foothills",
    ]);
    expect(worldPath.totalNodeCount).toBe(1);
  });
});
