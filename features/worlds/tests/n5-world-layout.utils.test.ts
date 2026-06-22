import { describe, expect, it } from "vitest";

import type { JourneyNode } from "@/features/journey/types/journey.types";
import { resolveN5NodeCanvasPositions } from "@/features/worlds/utils/n5-world-layout.utils";

function makeNode(id: string, regionIndex: number): JourneyNode {
  return {
    id,
    lessonId: id,
    kind: "lesson",
    label: id,
    subtitle: null,
    lessonType: "vocabulary",
    state: "locked",
    pathPosition: regionIndex / 40,
    regionIndex,
    globalIndex: regionIndex,
    href: null,
    xpReward: 10,
  };
}

describe("resolveN5NodeCanvasPositions", () => {
  it("spreads nodes with minimum vertical separation along the spine", () => {
    const nodes = Array.from({ length: 40 }, (_, index) =>
      makeNode(`lesson-${index}`, index),
    );
    const positions = resolveN5NodeCanvasPositions(nodes);
    const ordered = nodes
      .map((node) => positions.get(node.id)!)
      .sort((a, b) => b.y - a.y);

    const yGaps = ordered.slice(1).map((point, index) => ordered[index]!.y - point.y);
    expect(Math.min(...yGaps)).toBeGreaterThanOrEqual(1.5);
  });

  it("preserves journey order when region indices are out of sort order", () => {
    const nodes = [
      makeNode("b", 2),
      makeNode("a", 0),
      makeNode("c", 1),
    ];
    const positions = resolveN5NodeCanvasPositions(nodes);
    expect(positions.get("a")!.y).toBeGreaterThan(positions.get("c")!.y);
    expect(positions.get("c")!.y).toBeGreaterThan(positions.get("b")!.y);
  });
});
