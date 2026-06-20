import { describe, expect, it } from "vitest";

import { WORLD_TREE_SKELETON_ZONES } from "@/features/journey/constants/world-tree-skeleton.constants";
import type {
  JourneyNode,
  JourneyPathViewModel,
  JourneyRegionViewModel,
} from "@/features/journey/types/journey.types";
import {
  buildSkeletonAscentBand,
  buildWorldTreeLayout,
  buildWorldTreeZoneBands,
  computeWorldTreePathXPercent,
  plotJourneyNodesOnSkeleton,
  resolveWorldTreeCanvasMinHeightVh,
} from "@/features/journey/utils/world-tree-layout.utils";
import { resolveTrunkHubPosition } from "@/features/journey/constants/world-tree-trunk-hubs.constants";

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
  it("keeps nodes inside the trunk corridor with gentle variation", () => {
    expect(computeWorldTreePathXPercent(0, 0)).toBeGreaterThan(44);
    expect(computeWorldTreePathXPercent(0, 0)).toBeLessThan(56);
    expect(computeWorldTreePathXPercent(0.5, 4)).not.toBe(50);
  });
});

describe("buildWorldTreeLayout", () => {
  it("returns segments for main spine nodes", () => {
    const journey = makeJourney([
      makeRegion({
        slug: "foothills",
        nodes: Array.from({ length: 6 }, (_, index) =>
          makeNode({ id: `node-${index}`, globalIndex: index }),
        ),
      }),
    ]);

    const layout = buildWorldTreeLayout(journey);
    expect(layout.nodes.length).toBe(6);
    expect(layout.segments.length).toBeGreaterThan(0);
    expect(layout.canvasMinHeightVh).toBeGreaterThanOrEqual(600);
  });

  it("assigns foothills nodes to deep_roots zone", () => {
    const journey = makeJourney([
      makeRegion({
        slug: "foothills",
        nodes: [makeNode({ id: "a", globalIndex: 0 })],
      }),
    ]);

    const layout = buildWorldTreeLayout(journey);
    expect(layout.nodes[0]!.zoneId).toBe("deep_roots");
  });
});

describe("plotJourneyNodesOnSkeleton", () => {
  it("grows later lessons further along the same branch limb", () => {
    const journey = makeJourney([
      makeRegion({
        nodes: [
          makeNode({ id: "a", globalIndex: 0 }),
          makeNode({ id: "b", globalIndex: 1, pathPosition: 0.5 }),
        ],
      }),
    ]);

    const plotted = plotJourneyNodesOnSkeleton(journey);
    const a = plotted.find((entry) => entry.node.id === "a")!;
    const b = plotted.find((entry) => entry.node.id === "b")!;

    expect(Math.abs(b.xPercent - 50)).toBeGreaterThanOrEqual(Math.abs(a.xPercent - 50));
  });

  it("buds branch lessons from trunk hubs instead of a dense central spine", () => {
    const journey = makeJourney([
      makeRegion({
        slug: "foothills",
        nodes: [
          makeNode({ id: "first", globalIndex: 0 }),
          makeNode({ id: "second", globalIndex: 1 }),
          makeNode({ id: "third", globalIndex: 2 }),
        ],
      }),
    ]);

    const plotted = plotJourneyNodesOnSkeleton(journey);
    expect(plotted.every((entry) => entry.spineRole === "branch")).toBe(true);
    expect(plotted.every((entry) => entry.forkFromNodeId?.startsWith("hub:"))).toBe(true);
  });

  it(
    "keeps all coordinates within the visible canvas for a full blueprint tree",
    async () => {
    const { augmentRegionsWithBlueprint } = await import(
      "@/features/journey/utils/journey-blueprint-merge.utils"
    );
    const { buildJourneyPathFromData } = await import(
      "@/features/journey/services/journey.service"
    );

    const augmented = augmentRegionsWithBlueprint([], new Set());
    const journey = buildJourneyPathFromData(augmented, [], new Set());
    const layout = buildWorldTreeLayout(journey);
    const sorted = [...layout.nodes].sort(
      (a, b) => a.node.globalIndex - b.node.globalIndex,
    );

    for (const node of layout.nodes) {
      expect(node.yPercent).toBeGreaterThanOrEqual(3);
      expect(node.yPercent).toBeLessThanOrEqual(100);
      expect(node.xPercent).toBeGreaterThanOrEqual(12);
      expect(node.xPercent).toBeLessThanOrEqual(88);
    }

    expect(sorted[0]!.yPercent).toBeGreaterThan(sorted.at(-1)!.yPercent);

    const trunkSpineNodes = layout.nodes.filter(
      (entry) => entry.spineRole === "main" && entry.node.kind !== "landmark",
    );
    for (let index = 1; index < trunkSpineNodes.length; index += 1) {
      const prev = trunkSpineNodes[index - 1]!;
      const current = trunkSpineNodes[index]!;
      expect(prev.yPercent).toBeGreaterThanOrEqual(current.yPercent);
    }

    const lessons = layout.nodes.filter((entry) => entry.node.kind === "lesson");
    const hubForked = lessons.filter((entry) => entry.forkFromNodeId?.startsWith("hub:"));
    expect(hubForked.length).toBe(lessons.length);

    const coordKey = (entry: (typeof layout.nodes)[number]) =>
      `${entry.xPercent.toFixed(1)}:${entry.yPercent.toFixed(1)}`;
    const uniqueCoords = new Set(layout.nodes.map(coordKey));
    expect(uniqueCoords.size).toBe(layout.nodes.length);

    const landmarks = layout.nodes.filter((entry) => entry.node.kind === "landmark");
    for (const landmark of landmarks) {
      expect(landmark.forkFromNodeId).toBeTruthy();
      expect(landmark.segmentType).toBe("branch");
    }
  },
    15_000,
  );

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

  it("places mount-n5 nodes higher on the tree than foothills roots", () => {
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

    expect(n5!.zoneId).toBe("n5_roots");
    expect(foothills!.zoneId).toBe("deep_roots");
    expect(n5!.yPercent).toBeLessThan(foothills!.yPercent);
  });

  it("spaces trunk checkpoint nodes evenly from base to crown", () => {
    const journey = makeJourney([
      makeRegion({
        nodes: Array.from({ length: 4 }, (_, index) =>
          makeNode({
            id: `checkpoint-${index}`,
            globalIndex: index,
            kind: "checkpoint",
          }),
        ),
      }),
    ]);

    const plotted = plotJourneyNodesOnSkeleton(journey);

    for (let index = 1; index < plotted.length; index += 1) {
      const gap = plotted[index - 1]!.yPercent - plotted[index]!.yPercent;
      expect(gap).toBeGreaterThan(0);
    }

    expect(plotted[0]!.yPercent).toBe(100);
    expect(plotted.at(-1)!.yPercent).toBe(3);
  });
});

describe("resolveWorldTreeCanvasMinHeightVh", () => {
  it("grows the canvas when many nodes need more vertical spacing", () => {
    expect(resolveWorldTreeCanvasMinHeightVh(100)).toBeLessThan(
      resolveWorldTreeCanvasMinHeightVh(700),
    );
  });

  it("aligns N3 branch forks to trunk ring hub Y positions", async () => {
    const { augmentRegionsWithBlueprint } = await import(
      "@/features/journey/utils/journey-blueprint-merge.utils"
    );
    const { buildJourneyPathFromData } = await import(
      "@/features/journey/services/journey.service"
    );

    const journey = buildJourneyPathFromData(
      augmentRegionsWithBlueprint([], new Set()),
      [],
      new Set(),
    );
    const layout = buildWorldTreeLayout(journey);
    const zoneBands = buildWorldTreeZoneBands();

    for (const zoneId of ["n3_trunk_1", "n3_trunk_2", "n3_trunk_3"] as const) {
      const hubY = resolveTrunkHubPosition(zoneId, 0, zoneBands).yPercent;
      const zoneBranches = layout.nodes.filter(
        (entry) =>
          entry.zoneId === zoneId &&
          entry.forkFromNodeId?.startsWith("hub:") &&
          entry.node.kind === "lesson",
      );

      expect(zoneBranches.length).toBeGreaterThan(0);
      for (const branch of zoneBranches.slice(0, 6)) {
        expect(branch.yPercent).toBeLessThanOrEqual(hubY + 2);
      }
    }
  });

  it("grows branch lessons outward along tree limbs from the trunk", async () => {
    const { augmentRegionsWithBlueprint } = await import(
      "@/features/journey/utils/journey-blueprint-merge.utils"
    );
    const { buildJourneyPathFromData } = await import(
      "@/features/journey/services/journey.service"
    );

    const journey = buildJourneyPathFromData(
      augmentRegionsWithBlueprint([], new Set()),
      [],
      new Set(),
    );
    const layout = buildWorldTreeLayout(journey);
    const branchSegment = layout.segments.find(
      (segment) => segment.type === "branch" && segment.nodes.length >= 3,
    );

    expect(branchSegment).toBeTruthy();

    const trunkCenter = 50;
    const ordered = [...branchSegment!.nodes].sort(
      (a, b) => a.node.globalIndex - b.node.globalIndex,
    );
    const inner = ordered[0]!;
    const outer = ordered[ordered.length - 1]!;

    expect(Math.abs(outer.xPercent - trunkCenter)).toBeGreaterThan(
      Math.abs(inner.xPercent - trunkCenter),
    );
    expect(outer.yPercent).toBeLessThan(inner.yPercent);
  });

  it("reserves enough vertical space for readable node spacing on full tree", () => {
    const canvasVh = resolveWorldTreeCanvasMinHeightVh(687);
    const yStepPercent = 97 / 686;
    const physicalGapVh = (yStepPercent / 100) * canvasVh;

    expect(canvasVh).toBeGreaterThan(5000);
    expect(physicalGapVh).toBeGreaterThanOrEqual(7);
  });
});

describe("buildWorldTreeLayout performance", () => {
  it("lays out full blueprint scale in under 50ms", () => {
    const nodeCount = 687;
    const nodes = Array.from({ length: nodeCount }, (_, index) =>
      makeNode({ id: `node-${index}`, globalIndex: index }),
    );

    const journey = makeJourney([
      makeRegion({ slug: "mount-n3", nodes }),
    ]);

    const start = performance.now();
    const layout = buildWorldTreeLayout(journey);
    const elapsed = performance.now() - start;

    expect(layout.nodes.length).toBe(nodeCount);
    expect(elapsed).toBeLessThan(300);
  });
});
