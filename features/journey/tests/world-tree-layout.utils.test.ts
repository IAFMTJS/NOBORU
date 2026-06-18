import { describe, expect, it } from "vitest";

import { WORLD_TREE_SKELETON_ZONES } from "@/features/journey/constants/world-tree-skeleton.constants";
import type {
  JourneyNode,
  JourneyPathViewModel,
  JourneyRegionViewModel,
} from "@/features/journey/types/journey.types";
import {
  buildSkeletonAscentBand,
  buildWorldTreeZoneBands,
  computeWorldTreePathXPercent,
  plotJourneyNodesOnSkeleton,
  resolveWorldTreeCanvasMinHeightVh,
} from "@/features/journey/utils/world-tree-layout.utils";
import { WORLD_TREE_NODE_MIN_Y_GAP } from "@/features/journey/constants/world-tree-full-ascent.constants";

function makeNode(overrides: Partial<JourneyNode> = {}): JourneyNode {
  return {
    id: "node-1",
    lessonId: "lesson-1",
    kind: "lesson",
    label: "Lesson 1",
    subtitle: "vocabulary · 10 XP",
    lessonType: "vocabulary",
    state: "available",
    pathPosition: 0,
    regionIndex: 0,
    globalIndex: 0,
    href: "/learn/lesson/lesson-1",
    xpReward: 10,
    ...overrides,
  };
}

function makeRegion(
  overrides: Partial<JourneyRegionViewModel> = {},
): JourneyRegionViewModel {
  return {
    id: "region-1",
    slug: "foothills",
    name: "Foothills",
    description: null,
    availability: "available",
    lockReason: null,
    lessonCount: 1,
    completedCount: 0,
    progressPercent: 0,
    nodes: [makeNode()],
    currentNodeIndex: 0,
    ...overrides,
  };
}

function makeJourney(regions: JourneyRegionViewModel[]): JourneyPathViewModel {
  return {
    regions,
    position: {
      currentRegionSlug: regions[0]?.slug ?? "foothills",
      currentRegionIndex: 0,
      currentLessonId: regions[0]?.nodes[0]?.lessonId ?? null,
      currentNodeId: regions[0]?.nodes[0]?.id ?? null,
      globalNodeIndex: 0,
      globalLessonIndex: 0,
      pathPosition: 0,
    },
    nextLessonId: null,
    nextLessonHref: null,
  };
}

describe("buildWorldTreeZoneBands", () => {
  it("covers the full skeleton from base to crown", () => {
    const bands = buildWorldTreeZoneBands();
    const total = WORLD_TREE_SKELETON_ZONES.reduce(
      (sum, zone) => sum + zone.heightPercent,
      0,
    );

    expect(bands.deep_roots.yMax).toBe(100);
    expect(bands.n1_celestial.yMin).toBe(0);
    expect(total).toBe(100);
  });
});

describe("buildSkeletonAscentBand", () => {
  it("spans the full skeleton height", () => {
    expect(buildSkeletonAscentBand()).toEqual({ yMin: 0, yMax: 100 });
  });
});

describe("computeWorldTreePathXPercent", () => {
  it("keeps nodes near the trunk center with gentle variation", () => {
    expect(computeWorldTreePathXPercent(0, 0)).toBeGreaterThan(38);
    expect(computeWorldTreePathXPercent(0, 0)).toBeLessThan(62);
    expect(computeWorldTreePathXPercent(0.5, 4)).not.toBe(50);
  });
});

describe("plotJourneyNodesOnSkeleton", () => {
  it("places the first node at the stack base and later nodes higher", () => {
    const journey = makeJourney([
      makeRegion({
        nodes: [
          makeNode({ id: "a", globalIndex: 0 }),
          makeNode({ id: "b", globalIndex: 1, pathPosition: 0.5 }),
        ],
      }),
    ]);

    const plotted = plotJourneyNodesOnSkeleton(journey);
    expect(plotted[0]!.yPercent).toBeGreaterThan(plotted[1]!.yPercent);
  });

  it("orders nodes by global index", () => {
    const journey = makeJourney([
      makeRegion({
        nodes: [
          makeNode({ id: "a", globalIndex: 1, pathPosition: 0.2 }),
          makeNode({ id: "b", globalIndex: 0, pathPosition: 0 }),
        ],
      }),
    ]);

    const plotted = plotJourneyNodesOnSkeleton(journey);
    expect(plotted.map((entry) => entry.node.id)).toEqual(["b", "a"]);
  });

  it("places mount-n5 nodes below foothills nodes when global index is lower", () => {
    const journey = makeJourney([
      makeRegion({
        slug: "foothills",
        nodes: [makeNode({ id: "foothills", globalIndex: 1 })],
      }),
      makeRegion({
        slug: "mount-n5",
        name: "Mount N5",
        nodes: [makeNode({ id: "n5", globalIndex: 0 })],
      }),
    ]);

    const plotted = plotJourneyNodesOnSkeleton(journey);
    const n5 = plotted.find((entry) => entry.node.id === "n5");
    const foothills = plotted.find((entry) => entry.node.id === "foothills");

    expect(n5!.yPercent).toBeGreaterThan(foothills!.yPercent);
  });

  it("enforces minimum vertical spacing between consecutive nodes", () => {
    const journey = makeJourney([
      makeRegion({
        nodes: Array.from({ length: 8 }, (_, index) =>
          makeNode({ id: `node-${index}`, globalIndex: index }),
        ),
      }),
    ]);

    const plotted = plotJourneyNodesOnSkeleton(journey);

    for (let index = 1; index < plotted.length; index += 1) {
      const gap = plotted[index - 1]!.yPercent - plotted[index]!.yPercent;
      expect(gap).toBeGreaterThanOrEqual(WORLD_TREE_NODE_MIN_Y_GAP - 0.01);
    }
  });
});

describe("resolveWorldTreeCanvasMinHeightVh", () => {
  it("grows the canvas when many nodes need more vertical spacing", () => {
    expect(resolveWorldTreeCanvasMinHeightVh(1)).toBeLessThan(
      resolveWorldTreeCanvasMinHeightVh(40),
    );
  });
});
