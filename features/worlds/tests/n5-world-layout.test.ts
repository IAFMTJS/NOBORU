import { describe, expect, it } from "vitest";

import type { PlottedSkeletonNode } from "@/features/journey/utils/world-tree-layout.utils";
import { getJlptWorldDefinition } from "@/features/worlds/constants/world-registry.constants";
import { interpolateN5Waypoints } from "@/features/worlds/worlds/n5/n5-world-layout.constants";
import { tuneN5WorldLayout } from "@/features/worlds/worlds/n5/n5-world-layout.utils";

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
    regionSlug: "mount-n5",
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
  it("uses a wide horizontal swing on the path", () => {
    const left = interpolateN5Waypoints(0.48);
    const right = interpolateN5Waypoints(0.16);

    expect(left.x).toBeLessThan(40);
    expect(right.x).toBeGreaterThan(65);
  });

  it("distributes nodes evenly by climb rank instead of collapsing at the base", () => {
    const nodes = Array.from({ length: 40 }, (_, index) =>
      makeNode(`node-${index}`, index * 5, {
        spineRole: index % 4 === 0 ? "branch" : "main",
        segmentType: index % 4 === 0 ? "branch" : "main_spine",
        branchId: index % 4 === 0 ? `branch-${index % 3}` : "main",
      }),
    );

    const tuned = tuneN5WorldLayout(
      { nodes, segments: [], canvasMinHeightVh: 420, hubPositions: {} },
      stubWorldPath,
    );

    const yValues = tuned.nodes.map((node) => node.yPercent);
    const xValues = tuned.nodes.map((node) => node.xPercent);

    expect(Math.max(...yValues) - Math.min(...yValues)).toBeGreaterThan(60);
    expect(Math.max(...xValues) - Math.min(...xValues)).toBeGreaterThan(35);

    const bottomThird = tuned.nodes.slice(0, 13);
    const bottomYSpread =
      Math.max(...bottomThird.map((n) => n.yPercent)) -
      Math.min(...bottomThird.map((n) => n.yPercent));
    expect(bottomYSpread).toBeGreaterThan(8);
  });
});
