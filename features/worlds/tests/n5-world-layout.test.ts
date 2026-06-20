import { describe, expect, it } from "vitest";

import type { PlottedSkeletonNode } from "@/features/journey/utils/world-tree-layout.utils";
import { getJlptWorldDefinition } from "@/features/worlds/constants/world-registry.constants";
import {
  interpolateN5Waypoints,
  N5_REGION_SLOT_TARGETS,
  resolveN5RegionProgress,
  resolveN5RegionY,
} from "@/features/worlds/worlds/n5/n5-world-layout.constants";
import { tuneN5WorldLayout } from "@/features/worlds/worlds/n5/n5-world-layout.utils";

function makeNode(
  id: string,
  globalIndex: number,
  regionSlug: string,
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
    regionSlug,
    zoneId: "n5_roots",
    xPercent: 50,
    yPercent: 50,
    spineRole: options.spineRole ?? "main",
    segmentType: options.segmentType ?? "main_spine",
    branchId: options.branchId ?? "main",
  };
}

const stubWorldPath = {
  world: getJlptWorldDefinition("n5"),
  journey: { regions: [], position: {} as never, nextLessonId: null, nextLessonHref: null },
  position: {} as never,
  completedNodeCount: 0,
  totalNodeCount: 0,
  nextLessonId: null,
  nextLessonHref: null,
};

describe("N5 waypoint layout", () => {
  it("documents expected N5 slot targets", () => {
    const total =
      N5_REGION_SLOT_TARGETS.foothills +
      N5_REGION_SLOT_TARGETS["forest-trail"] +
      N5_REGION_SLOT_TARGETS["mount-n5"];

    expect(total).toBe(132);
  });

  it("anchors foothills on the World Heart tree center", () => {
    const nodes = Array.from({ length: 5 }, (_, index) =>
      makeNode(`fh-${index}`, index, "foothills"),
    );

    const tuned = tuneN5WorldLayout(
      { nodes, segments: [], canvasMinHeightVh: 420, hubPositions: {} },
      stubWorldPath,
    );

    for (const node of tuned.nodes) {
      expect(node.xPercent).toBeGreaterThan(30);
      expect(node.xPercent).toBeLessThan(70);
      expect(node.yPercent).toBeGreaterThan(78);
      expect(node.yPercent).toBeLessThanOrEqual(99.5);
    }
  });

  it("gives mount-n5 most of the vertical climb band", () => {
    const mountStart = resolveN5RegionProgress("mount-n5", 0, 95);
    const mountEnd = resolveN5RegionProgress("mount-n5", 94, 95);
    const foothillsEnd = resolveN5RegionProgress("foothills", 19, 20);

    expect(mountStart).toBeGreaterThan(foothillsEnd);
    expect(mountEnd - mountStart).toBeGreaterThan(0.5);

    const mountYStart = resolveN5RegionY("mount-n5", 0, 95);
    const mountYEnd = resolveN5RegionY("mount-n5", 94, 95);
    const foothillsYEnd = resolveN5RegionY("foothills", 19, 20);

    expect(mountYStart).toBeLessThan(foothillsYEnd);
    expect(mountYStart - mountYEnd).toBeGreaterThan(45);
  });

  it("uses a wide horizontal swing on the path", () => {
    const left = interpolateN5Waypoints(0.48);
    const right = interpolateN5Waypoints(0.16);

    expect(left.x).toBeLessThan(40);
    expect(right.x).toBeGreaterThan(65);
  });
});
