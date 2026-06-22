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

  it("places all four JLPT biome transition seams", () => {
    const layout = buildJlptZoneArtLayout("light");
    const transitions = layout.fill.filter((piece) => piece.kind === "transition");

    expect(transitions).toHaveLength(4);
    expect(transitions.map((piece) => piece.id).sort()).toEqual([
      "n2-transition",
      "n3-transition",
      "n4-transition",
      "n5-transition",
    ]);
    expect(transitions.every((piece) => piece.src.includes("/transitions/"))).toBe(true);
  });

  it("uses canopy and celestial fill art in N2 and N1 bands", () => {
    const layout = buildJlptZoneArtLayout("light");
    const n2Fill = layout.fill.filter(
      (piece) => piece.kind === "fill" && piece.id.startsWith("n2-"),
    );
    const n1Fill = layout.fill.filter(
      (piece) => piece.kind === "fill" && piece.id.startsWith("n1-"),
    );

    expect(n2Fill.some((piece) => piece.src.includes("canopy_a"))).toBe(true);
    expect(n1Fill.some((piece) => piece.src.includes("celestial_a"))).toBe(true);
  });

  it("maps five equal JLPT bands bottom to top", () => {
    const bands = buildWorldTreeJlptBandLayout();
    expect(bands[0]?.id).toBe("n5");
    expect(bands[0]?.yMin).toBe(80);
    expect(bands[4]?.id).toBe("n1");
    expect(bands[4]?.yMax).toBe(20);
  });

  it("uses a wide transition box for the ancient-to-canopy seam", () => {
    const layout = buildJlptZoneArtLayout("light");
    const n3Transition = layout.fill.find((piece) => piece.id === "n3-transition");

    expect(n3Transition).toBeDefined();
    expect(n3Transition!.widthPercent).toBeGreaterThanOrEqual(70);
    expect(n3Transition!.heightPercent).toBeGreaterThan(5);
  });

  it("allocates larger hero slots after layout tuning", () => {
    const layout = buildJlptZoneArtLayout("light");
    const n5Hero = layout.heroes.find((hero) => hero.bandId === "n5");
    const n1Hero = layout.heroes.find((hero) => hero.bandId === "n1");

    expect(n5Hero!.heightPercent).toBeGreaterThanOrEqual(18);
    expect(n1Hero!.heightPercent).toBeGreaterThanOrEqual(19);
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
