import { describe, expect, it } from "vitest";

import { buildWorldTreeJlptBandLayout } from "@/features/journey/constants/world-tree-jlpt-band.constants";
import {
  assignSpineYByJlptBand,
  buildJlptZoneArtLayout,
  countSpineNodesByJlptBand,
} from "@/features/journey/utils/world-tree-jlpt-zone-layout.utils";
import type { PlottedSkeletonNode } from "@/features/journey/utils/world-tree-layout.utils";

function makeSpineNode(
  id: string,
  globalIndex: number,
  zoneId: PlottedSkeletonNode["zoneId"],
  yPercent: number,
): PlottedSkeletonNode {
  return {
    node: {
      id,
      globalIndex,
      kind: "lesson",
      label: id,
      subtitle: null,
      href: `/learn/lesson/${id}`,
      state: "available",
      lessonId: id,
      lessonType: "vocabulary",
      pathPosition: globalIndex,
      regionIndex: 0,
      xpReward: 10,
    },
    regionSlug: "foothills",
    zoneId,
    xPercent: 50,
    yPercent,
    spineRole: "main",
    segmentType: "main_spine",
    branchId: "foothills-main",
  };
}

describe("buildJlptZoneArtLayout", () => {
  it("places fill, hero, and gap art for all five JLPT bands", () => {
    const layout = buildJlptZoneArtLayout("light");

    expect(layout.heroes).toHaveLength(5);
    expect(layout.fill.length).toBeGreaterThan(10);
    expect(layout.gaps.length).toBeGreaterThan(0);

    for (const hero of layout.heroes) {
      expect(hero.heightPercent).toBeGreaterThan(0);
      expect(hero.src).toContain("jlpt-bands");
    }
  });

  it("maps five equal JLPT bands bottom to top", () => {
    const bands = buildWorldTreeJlptBandLayout();
    expect(bands[0]?.id).toBe("n5");
    expect(bands[0]?.yMin).toBe(80);
    expect(bands[4]?.id).toBe("n1");
    expect(bands[4]?.yMax).toBe(20);
  });
});

describe("assignSpineYByJlptBand", () => {
  it("distributes spine nodes within their JLPT band y range", () => {
    const nodes = [
      makeSpineNode("a", 0, "n5_roots", 50),
      makeSpineNode("b", 1, "n5_roots", 50),
      makeSpineNode("c", 2, "n4_foothills", 50),
    ];

    const yMap = assignSpineYByJlptBand(nodes);

    expect(yMap.get("a")).toBeGreaterThan(80);
    expect(yMap.get("b")).toBeGreaterThan(80);
    expect(yMap.get("c")).toBeGreaterThan(60);
    expect(yMap.get("c")!).toBeLessThan(80);
  });

  it("groups spine nodes by JLPT band", () => {
    const nodes = [
      makeSpineNode("a", 0, "n3_trunk_1", 50),
      makeSpineNode("b", 1, "n3_trunk_2", 50),
    ];
    const buckets = countSpineNodesByJlptBand(nodes);
    expect(buckets.n3).toHaveLength(2);
    expect(buckets.n5).toHaveLength(0);
  });
});
