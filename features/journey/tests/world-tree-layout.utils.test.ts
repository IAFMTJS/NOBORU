import { describe, expect, it } from "vitest";

import { WORLD_TREE_SKELETON_ZONES } from "@/features/journey/constants/world-tree-skeleton.constants";
import type {
  JourneyNode,
  JourneyPathViewModel,
  JourneyRegionViewModel,
} from "@/features/journey/types/journey.types";
import {
  buildProducedStackBand,
  buildWorldTreeTileBands,
  buildWorldTreeZoneBands,
  buildZoneTileBands,
  computeWorldTreePathXPercent,
  plotJourneyNodesOnSkeleton,
} from "@/features/journey/utils/world-tree-layout.utils";

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

describe("buildWorldTreeTileBands", () => {
  it("maps the bottom tile to the base of the stack", () => {
    const bands = buildWorldTreeTileBands();
    const rootsA = bands.get("roots_a");

    expect(rootsA).toBeDefined();
    expect(rootsA!.yMin).toBe(0);
    expect(rootsA!.yMax).toBeGreaterThan(0);
  });

  it("maps the crown transition tile above the roots", () => {
    const bands = buildWorldTreeTileBands();
    const transition = bands.get("transition_ancient_to_canopy");
    const rootsA = bands.get("roots_a");

    expect(transition!.yMin).toBeGreaterThan(rootsA!.yMax);
  });
});

describe("buildProducedStackBand", () => {
  it("spans from roots base to highest produced tile", () => {
    const stackBand = buildProducedStackBand();
    const tileBands = buildWorldTreeTileBands();

    expect(stackBand).not.toBeNull();
    expect(stackBand!.yMin).toBe(0);
    expect(stackBand!.yMax).toBe(
      Math.max(...[...tileBands.values()].map((band) => band.yMax)),
    );
  });
});

describe("buildZoneTileBands", () => {
  it("covers produced art zones on the stack", () => {
    const zoneBands = buildZoneTileBands();

    expect(zoneBands.n5_roots).toBeDefined();
    expect(zoneBands.n4_foothills).toBeDefined();
    expect(zoneBands.n3_trunk_1).toBeDefined();
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
});
