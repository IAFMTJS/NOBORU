import { describe, expect, it } from "vitest";

import { WORLD_TREE_SKELETON_ZONES } from "@/features/journey/constants/world-tree-skeleton.constants";
import type {
  JourneyNode,
  JourneyPathViewModel,
  JourneyRegionViewModel,
} from "@/features/journey/types/journey.types";
import {
  buildWorldTreeTileBands,
  buildWorldTreeZoneBands,
  buildZoneTileBands,
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

describe("buildZoneTileBands", () => {
  it("covers produced art zones on the stack", () => {
    const zoneBands = buildZoneTileBands();

    expect(zoneBands.n5_roots).toBeDefined();
    expect(zoneBands.n4_foothills).toBeDefined();
    expect(zoneBands.n3_trunk_1).toBeDefined();
  });
});

describe("plotJourneyNodesOnSkeleton", () => {
  it("places foothills nodes inside the N4 foothills tile band", () => {
    const journey = makeJourney([makeRegion()]);
    const zoneBands = buildZoneTileBands();
    const [plotted] = plotJourneyNodesOnSkeleton(journey);

    expect(plotted).toBeDefined();
    expect(plotted!.yPercent).toBeGreaterThan(zoneBands.n4_foothills!.yMin);
    expect(plotted!.yPercent).toBeLessThanOrEqual(zoneBands.n4_foothills!.yMax);
    expect(plotted!.xPercent).toBeGreaterThan(30);
    expect(plotted!.xPercent).toBeLessThan(70);
  });

  it("places mount-n5 nodes in the roots tile band below foothills", () => {
    const journey = makeJourney([
      makeRegion({
        slug: "mount-n5",
        name: "Mount N5",
        nodes: [makeNode({ pathPosition: 0.5 })],
      }),
    ]);
    const zoneBands = buildZoneTileBands();
    const [plotted] = plotJourneyNodesOnSkeleton(journey);

    expect(plotted!.yPercent).toBeGreaterThan(zoneBands.n5_roots!.yMin);
    expect(plotted!.yPercent).toBeLessThan(zoneBands.n5_roots!.yMax);
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
});
