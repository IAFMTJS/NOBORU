import { describe, expect, it } from "vitest";

import type { JourneyNode } from "@/features/journey/types/journey.types";
import { N5_LANDMARK_FALLBACKS } from "@/features/worlds/constants/n5-landmarks.constants";
import { N5_RESERVED_NODE_SLOTS } from "@/features/worlds/constants/n5-reserved-nodes.constants";
import {
  N5_TARGET_NODE_GAP_VH,
  resolveN5ScrollMinHeightVh,
} from "@/features/worlds/constants/n5-world.constants";
import {
  buildN5SpineOccupancy,
  measureMinVisibleYGapPercent,
  resolveN5FullSpineSlotMap,
  resolveN5LayoutScrollMinHeightVh,
  resolveN5NodeCanvasPositions,
  resolveN5ReservedNodePositions,
} from "@/features/worlds/utils/n5-world-layout.utils";

function makeLessonNode(id: string, regionIndex: number): JourneyNode {
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

function makeLandmarkNode(slug: string, regionIndex: number): JourneyNode {
  const landmark = N5_LANDMARK_FALLBACKS.find((entry) => entry.slug === slug)!;
  return {
    id: `landmark-${slug}`,
    lessonId: null,
    kind: "landmark",
    landmarkKind: landmark.kind,
    label: landmark.label,
    subtitle: landmark.subtitle,
    lessonType: null,
    state: "locked",
    pathPosition: landmark.pathPosition ?? 0.5,
    regionIndex,
    globalIndex: regionIndex,
    href: null,
    xpReward: null,
  };
}

describe("resolveN5ScrollMinHeightVh", () => {
  it("grows with node count to preserve target gap", () => {
    expect(resolveN5ScrollMinHeightVh(32)).toBeGreaterThan(800);
    expect(resolveN5ScrollMinHeightVh(65)).toBeGreaterThan(resolveN5ScrollMinHeightVh(32));
    expect(resolveN5ScrollMinHeightVh(40)).toBe(
      Math.ceil((39 * N5_TARGET_NODE_GAP_VH * 100) / 87),
    );
  });
});

describe("resolveN5NodeCanvasPositions", () => {
  it("spreads visible nodes with wider vertical separation", () => {
    const nodes = Array.from({ length: 40 }, (_, index) =>
      makeLessonNode(`lesson-${index}`, index),
    );
    const scrollVh = resolveN5LayoutScrollMinHeightVh(nodes.length);
    const yGapPercent = measureMinVisibleYGapPercent(nodes);
    const gapVh = (yGapPercent / 100) * scrollVh;

    expect(scrollVh).toBeGreaterThanOrEqual(1100);
    expect(gapVh).toBeGreaterThanOrEqual(N5_TARGET_NODE_GAP_VH - 2);
  });

  it("preserves journey order when region indices are out of sort order", () => {
    const nodes = [
      makeLessonNode("b", 2),
      makeLessonNode("a", 0),
      makeLessonNode("c", 1),
    ];
    const positions = resolveN5NodeCanvasPositions(nodes);
    expect(positions.get("a")!.y).toBeGreaterThan(positions.get("c")!.y);
    expect(positions.get("c")!.y).toBeGreaterThan(positions.get("b")!.y);
  });
});

describe("N5 reserved spine slots", () => {
  it("keeps reserved slots out of visible spread density", () => {
    const nodes = Array.from({ length: 40 }, (_, index) =>
      makeLessonNode(`lesson-${index}`, index),
    );
    const withReserved = buildN5SpineOccupancy(nodes);
    const scrollVh = resolveN5LayoutScrollMinHeightVh(nodes.length);
    const gapVh =
      (measureMinVisibleYGapPercent(nodes) / 100) * scrollVh;

    expect(withReserved.length).toBe(nodes.length + N5_RESERVED_NODE_SLOTS.length);
    expect(gapVh).toBeGreaterThanOrEqual(N5_TARGET_NODE_GAP_VH - 2);
  });

  it("inserts invisible reserved slots into spine occupancy order", () => {
    const nodes = [
      makeLessonNode("lesson-0", 0),
      makeLandmarkNode("lantern-hamlet", 1),
      makeLessonNode("lesson-1", 2),
      makeLandmarkNode("market-bend", 3),
      makeLandmarkNode("forest-torii", 4),
      makeLandmarkNode("kanji-grove", 5),
      makeLandmarkNode("first-slope-shrine", 6),
    ];

    const occupancy = buildN5SpineOccupancy(nodes);
    const reservedCount = occupancy.filter((entry) => entry.kind === "reserved").length;

    expect(reservedCount).toBe(N5_RESERVED_NODE_SLOTS.length);
    expect(occupancy.length).toBe(nodes.length + N5_RESERVED_NODE_SLOTS.length);
  });

  it("reserves coordinates without returning them from visible node map", () => {
    const nodes = [
      makeLessonNode("lesson-0", 0),
      makeLandmarkNode("lantern-hamlet", 1),
      makeLandmarkNode("market-bend", 2),
      makeLandmarkNode("forest-torii", 3),
      makeLandmarkNode("kanji-grove", 4),
      makeLandmarkNode("first-slope-shrine", 5),
    ];

    const visible = resolveN5NodeCanvasPositions(nodes);
    const reserved = resolveN5ReservedNodePositions(nodes);

    expect(visible.has("n5-reserved-food-stall-row")).toBe(false);
    expect(reserved.has("n5-reserved-food-stall-row")).toBe(true);
    expect(reserved.get("n5-reserved-food-stall-row")!.pathPosition).toBe(0.404);
  });

  it("exports a full slot map for art authoring", () => {
    const nodes = [
      makeLessonNode("lesson-0", 0),
      makeLandmarkNode("lantern-hamlet", 1),
      makeLandmarkNode("forest-torii", 2),
    ];
    const slotMap = resolveN5FullSpineSlotMap(nodes);

    expect(slotMap.some((entry) => entry.kind === "reserved")).toBe(true);
    expect(slotMap.some((entry) => entry.kind === "visible")).toBe(true);
    expect(slotMap.every((entry) => entry.pathPosition >= 0)).toBe(true);
  });
});
