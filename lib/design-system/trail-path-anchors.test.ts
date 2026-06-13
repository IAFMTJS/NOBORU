import { describe, expect, it } from "vitest";

import { REGION_SLUGS } from "@/lib/design-system/regions";
import {
  getImmersiveTrailLayout,
  getTrailMapPathAnchors,
  getTrailNodePositions,
  TRAIL_SCROLL_ART_HEIGHT,
  TRAIL_SCROLL_ART_WIDTH,
} from "@/lib/design-system/trail-path-anchors";

describe("getTrailMapPathAnchors", () => {
  it("returns distinct scroll anchors per region", () => {
    const foothills = getTrailMapPathAnchors({
      regionSlug: "foothills",
      mode: "scroll",
      theme: "dark",
    });
    const forest = getTrailMapPathAnchors({
      regionSlug: "forest-trail",
      mode: "scroll",
      theme: "dark",
    });

    expect(foothills[2]).not.toEqual(forest[2]);
  });

  it("returns spine anchors that differ from scroll anchors", () => {
    const spine = getTrailMapPathAnchors({
      regionSlug: "foothills",
      mode: "spine",
      theme: "dark",
    });
    const scroll = getTrailMapPathAnchors({
      regionSlug: "foothills",
      mode: "scroll",
      theme: "dark",
    });

    expect(spine[3]).not.toEqual(scroll[3]);
  });

  it("defines anchors for every region slug", () => {
    for (const slug of REGION_SLUGS) {
      expect(getTrailMapPathAnchors({ regionSlug: slug, mode: "scroll" })).toHaveLength(14);
      expect(getTrailMapPathAnchors({ regionSlug: slug, mode: "scroll", theme: "light" })).toHaveLength(14);
    }
  });
});

describe("getTrailNodePositions", () => {
  it("places checkpoint nodes on spine anchor bends", () => {
    const positions = getTrailNodePositions(
      [
        { nodeKind: "lesson" },
        { nodeKind: "lesson" },
        { nodeKind: "checkpoint" },
        { nodeKind: "lesson" },
        { nodeKind: "checkpoint" },
      ],
      { regionSlug: "foothills", mode: "scroll", theme: "dark" },
    );

    expect(positions).toHaveLength(5);
    expect(positions[2]?.x).toBeCloseTo(50, 0);
    expect(positions[2]?.y).toBeCloseTo(93, 0);
    expect(positions[4]?.x).toBeCloseTo(50, 0);
    expect(positions[4]?.y).toBeCloseTo(6, 0);
    expect(positions[0]?.y).toBeGreaterThan(positions[4]?.y ?? 0);
  });

  it("preserves global trail position for sliced previews", () => {
    const full = getTrailNodePositions(10, {
      regionSlug: "foothills",
      mode: "spine",
      theme: "dark",
    });
    const slice = getTrailNodePositions(3, {
      regionSlug: "foothills",
      mode: "spine",
      theme: "dark",
      placementRange: { startIndex: 4, totalCount: 10 },
    });

    expect(slice[0]?.y).toBeLessThan(full[0]?.y ?? 100);
    expect(slice[0]?.y).toBeCloseTo(full[4]?.y ?? 0, 0);
    expect(slice[2]?.y).toBeCloseTo(full[6]?.y ?? 0, 0);
  });
});

describe("getImmersiveTrailLayout", () => {
  it("matches scroll art aspect ratio", () => {
    const layout = getImmersiveTrailLayout(20, {
      regionSlug: "foothills",
      mode: "scroll",
    });

    expect(layout.canvasAspectRatio).toBeCloseTo(
      TRAIL_SCROLL_ART_WIDTH / TRAIL_SCROLL_ART_HEIGHT,
      5,
    );
    expect(layout.positions).toHaveLength(20);
  });

  it("places the first lesson near the trail base and the last near the summit", () => {
    const layout = getImmersiveTrailLayout(20, {
      regionSlug: "mount-n5",
      mode: "scroll",
    });

    expect(layout.positions[0]?.y).toBeGreaterThan(layout.positions[19]?.y ?? 0);
    expect(layout.positions[0]?.y).toBeGreaterThan(80);
    expect(layout.positions[19]?.y).toBeLessThan(20);
  });

  it("varies x so nodes follow the winding spine", () => {
    const layout = getImmersiveTrailLayout(20, {
      regionSlug: "forest-trail",
      mode: "scroll",
    });
    const xValues = layout.positions.map((position) => position.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);

    expect(maxX - minX).toBeGreaterThan(10);
  });
});
