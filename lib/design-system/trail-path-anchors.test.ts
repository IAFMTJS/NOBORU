import { describe, expect, it } from "vitest";

import {
  getImmersiveTrailLayout,
  getTrailNodePositions,
  TRAIL_SCROLL_ART_HEIGHT,
  TRAIL_SCROLL_ART_WIDTH,
} from "@/lib/design-system/trail-path-anchors";

describe("getTrailNodePositions", () => {
  it("places checkpoint nodes on spine anchor bends", () => {
    const positions = getTrailNodePositions([
      { nodeKind: "lesson" },
      { nodeKind: "lesson" },
      { nodeKind: "checkpoint" },
      { nodeKind: "lesson" },
      { nodeKind: "checkpoint" },
    ]);

    expect(positions).toHaveLength(5);
    expect(positions[2]?.x).toBeCloseTo(50, 0);
    expect(positions[2]?.y).toBeCloseTo(93, 0);
    expect(positions[4]?.x).toBeCloseTo(50, 0);
    expect(positions[4]?.y).toBeCloseTo(6, 0);
    expect(positions[0]?.y).toBeGreaterThan(positions[4]?.y ?? 0);
  });
});

describe("getImmersiveTrailLayout", () => {
  it("matches scroll art aspect ratio", () => {
    const layout = getImmersiveTrailLayout(20);

    expect(layout.canvasAspectRatio).toBeCloseTo(
      TRAIL_SCROLL_ART_WIDTH / TRAIL_SCROLL_ART_HEIGHT,
      5,
    );
    expect(layout.positions).toHaveLength(20);
  });

  it("places the first lesson near the trail base and the last near the summit", () => {
    const layout = getImmersiveTrailLayout(20);

    expect(layout.positions[0]?.y).toBeGreaterThan(layout.positions[19]?.y ?? 0);
    expect(layout.positions[0]?.y).toBeGreaterThan(80);
    expect(layout.positions[19]?.y).toBeLessThan(20);
  });

  it("varies x so nodes follow the winding spine", () => {
    const layout = getImmersiveTrailLayout(20);
    const xValues = layout.positions.map((position) => position.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);

    expect(maxX - minX).toBeGreaterThan(10);
  });
});
