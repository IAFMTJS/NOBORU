import { describe, expect, it } from "vitest";

import { buildWorldMapViewModel } from "@/features/world-map/services/world-map.service";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";

function emptyJourney(regions: JourneyPathViewModel["regions"]): JourneyPathViewModel {
  return {
    regions,
    position: {
      currentRegionSlug: "n5",
      currentRegionIndex: 0,
      currentLessonId: null,
      currentNodeId: null,
      globalNodeIndex: 0,
      globalLessonIndex: 0,
      pathPosition: 0,
    },
    nextLessonId: null,
    nextLessonHref: null,
  };
}

describe("buildWorldMapViewModel", () => {
  it("always renders five JLPT world slots", () => {
    const data = buildWorldMapViewModel(
      emptyJourney([
        {
          id: "n5",
          slug: "n5",
          name: "Realm of First Light",
          description: null,
          availability: "available",
          lockReason: null,
          lessonCount: 10,
          completedCount: 2,
          progressPercent: 20,
          nodes: [],
          currentNodeIndex: null,
        },
      ]),
    );

    expect(data.regions).toHaveLength(5);
    expect(data.regions.map((region) => region.slug)).toEqual([
      "n5",
      "n4",
      "n3",
      "n2",
      "n1",
    ]);
    expect(data.regions.find((region) => region.slug === "n4")?.availability).toBe(
      "locked",
    );
  });
});
