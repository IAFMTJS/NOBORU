import { describe, expect, it } from "vitest";

import type { PlottedSkeletonNode } from "@/features/journey/utils/world-tree-layout.utils";
import { getJlptWorldDefinition } from "@/features/worlds/constants/world-registry.constants";
import {
  interpolateN4Waypoints,
  N4_REGION_SLOT_TARGETS,
  resolveN4RegionProgress,
  resolveN4RegionY,
} from "@/features/worlds/worlds/n4/n4-world-layout.constants";
import { tuneN4WorldLayout } from "@/features/worlds/worlds/n4/n4-world-layout.utils";

function makeNode(
  id: string,
  globalIndex: number,
  options: {
    spineRole?: PlottedSkeletonNode["spineRole"];
    segmentType?: PlottedSkeletonNode["segmentType"];
    branchId?: string;
  } = {},
): PlottedSkeletonNode {
  return {
    node: {
      id,
      lessonId: id,
      kind: "lesson",
      label: id,
      subtitle: null,
      lessonType: "vocabulary",
      state: "available",
      pathPosition: 0,
      regionIndex: 0,
      globalIndex,
      href: null,
      xpReward: 10,
    },
    regionSlug: "mount-n4",
    zoneId: "n4_foothills",
    xPercent: 50,
    yPercent: 50,
    spineRole: options.spineRole ?? "main",
    segmentType: options.segmentType ?? "main_spine",
    branchId: options.branchId ?? "main",
  };
}

const stubWorldPath = {
  world: getJlptWorldDefinition("n4"),
  journey: { regions: [], position: {} as never, nextLessonId: null, nextLessonHref: null },
  position: {} as never,
  completedNodeCount: 0,
  totalNodeCount: 0,
  nextLessonId: null,
  nextLessonHref: null,
};

describe("N4 waypoint layout", () => {
  it("documents expected N4 slot targets", () => {
    expect(N4_REGION_SLOT_TARGETS["mount-n4"]).toBe(85);
  });

  it("spreads base nodes across the foothills entry", () => {
    const nodes = Array.from({ length: 6 }, (_, index) =>
      makeNode(`n4-${index}`, index),
    );

    const tuned = tuneN4WorldLayout(
      { nodes, segments: [], canvasMinHeightVh: 380, hubPositions: {} },
      stubWorldPath,
    );

    const baseNodes = tuned.nodes.filter((node) => node.yPercent > 80);
    expect(baseNodes.length).toBeGreaterThan(0);

    for (const node of baseNodes) {
      expect(node.yPercent).toBeLessThanOrEqual(98.5);
    }

    const xValues = tuned.nodes.map((node) => node.xPercent);
    expect(Math.max(...xValues) - Math.min(...xValues)).toBeGreaterThan(8);
  });

  it("covers most of the vertical climb band", () => {
    const start = resolveN4RegionProgress("mount-n4", 0, 85);
    const end = resolveN4RegionProgress("mount-n4", 84, 85);

    expect(end - start).toBeGreaterThan(0.85);

    const yStart = resolveN4RegionY("mount-n4", 0, 85);
    const yEnd = resolveN4RegionY("mount-n4", 84, 85);

    expect(yStart - yEnd).toBeGreaterThan(80);
  });

  it("uses a wide horizontal swing on the path", () => {
    const left = interpolateN4Waypoints(0.5);
    const right = interpolateN4Waypoints(0.2);

    expect(left.x).toBeLessThan(45);
    expect(right.x).toBeGreaterThan(60);
  });
});
