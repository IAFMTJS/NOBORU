import { describe, expect, it } from "vitest";

import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import {
  findJourneyNodeById,
  resolveGlobalCurrentNode,
  resolveGlobalCurrentRegion,
} from "@/features/journey/utils/journey-world.utils";

const journeyFixture: JourneyPathViewModel = {
  regions: [
    {
      id: "r1",
      slug: "foothills",
      name: "Foothills",
      description: null,
      availability: "available",
      lockReason: null,
      lessonCount: 2,
      completedCount: 1,
      progressPercent: 50,
      currentNodeIndex: 1,
      nodes: [
        {
          id: "n1",
          lessonId: "l1",
          kind: "lesson",
          label: "Lesson 1",
          subtitle: null,
          lessonType: "vocabulary",
          state: "completed",
          pathPosition: 0.2,
          regionIndex: 0,
          globalIndex: 0,
          href: "/learn/lesson/l1",
          xpReward: 10,
        },
        {
          id: "n2",
          lessonId: "l2",
          kind: "lesson",
          label: "Lesson 2",
          subtitle: null,
          lessonType: "vocabulary",
          state: "in_progress",
          pathPosition: 0.6,
          regionIndex: 1,
          globalIndex: 1,
          href: "/learn/lesson/l2",
          xpReward: 10,
        },
      ],
    },
    {
      id: "r2",
      slug: "forest-trail",
      name: "Forest Trail",
      description: null,
      availability: "locked",
      lockReason: "Complete Foothills",
      lessonCount: 1,
      completedCount: 0,
      progressPercent: 0,
      currentNodeIndex: null,
      nodes: [],
    },
  ],
  position: {
    currentRegionSlug: "foothills",
    currentRegionIndex: 0,
    currentLessonId: "l2",
    currentNodeId: "n2",
    globalNodeIndex: 1,
    globalLessonIndex: 1,
    pathPosition: 0.6,
  },
  nextLessonId: "l2",
  nextLessonHref: "/learn/lesson/l2",
};

describe("journey-world.utils", () => {
  it("finds nodes and regions across the full path", () => {
    expect(findJourneyNodeById(journeyFixture, "n2")?.label).toBe("Lesson 2");
    expect(resolveGlobalCurrentNode(journeyFixture)?.id).toBe("n2");
    expect(resolveGlobalCurrentRegion(journeyFixture)?.slug).toBe("foothills");
  });
});
