import { describe, expect, it } from "vitest";

import type { PlottedSkeletonNode } from "@/features/journey/utils/world-tree-layout.utils";
import { getJlptWorldDefinition } from "@/features/worlds/constants/world-registry.constants";
import { tuneN5WorldLayout } from "@/features/worlds/worlds/n5/n5-world-layout.utils";

function makeSpineNode(
  id: string,
  globalIndex: number,
  regionSlug: string,
  yPercent: number,
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
    yPercent,
    spineRole: "main",
    segmentType: "main_spine",
    branchId: "main",
  };
}

describe("N5 world layout tuning", () => {
  it("places foothills nodes near the world base", () => {
    const layout = {
      nodes: [
        makeSpineNode("a", 0, "foothills", 50),
        makeSpineNode("b", 1, "foothills", 50),
      ],
      segments: [],
      canvasMinHeightVh: 200,
      hubPositions: {},
    };

    const tuned = tuneN5WorldLayout(layout, {
      world: getJlptWorldDefinition("n5"),
      journey: { regions: [], position: {} as never, nextLessonId: null, nextLessonHref: null },
      position: {} as never,
      completedNodeCount: 0,
      totalNodeCount: 0,
      nextLessonId: null,
      nextLessonHref: null,
    });

    expect(tuned.nodes[0]?.yPercent).toBeGreaterThan(90);
    expect(tuned.nodes[1]?.yPercent).toBeGreaterThan(85);
  });

  it("stacks mount-n5 nodes below the portal band", () => {
    const layout = {
      nodes: [
        makeSpineNode("start", 0, "mount-n5", 80),
        makeSpineNode("end", 50, "mount-n5", 80),
      ],
      segments: [],
      canvasMinHeightVh: 200,
      hubPositions: {},
    };

    const tuned = tuneN5WorldLayout(layout, {
      world: getJlptWorldDefinition("n5"),
      journey: { regions: [], position: {} as never, nextLessonId: null, nextLessonHref: null },
      position: {} as never,
      completedNodeCount: 0,
      totalNodeCount: 0,
      nextLessonId: null,
      nextLessonHref: null,
    });

    expect(tuned.nodes[0]?.yPercent).toBeGreaterThan(tuned.nodes[1]?.yPercent ?? 0);
    expect(tuned.nodes[1]?.yPercent).toBeLessThan(20);
  });
});
