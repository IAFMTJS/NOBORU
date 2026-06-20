import type {
  WorldTreeJlptHeroAnchor,
  WorldTreeSegmentId,
} from "@/features/journey/constants/world-tree-jlpt-segment.constants";

/** N5 full-canvas art tuning — band-local coords (0 = base, 1 = crown). */
export const N5_WORLD_ART_SPEC = {
  trunkCenterX: 50,
  hero: {
    anchor: "bottom" as WorldTreeJlptHeroAnchor,
    /** Hero island sits on the lower trunk mass. */
    yStart: 0.05,
    yEnd: 0.82,
    scale: 1.14,
    widthPercent: 112,
    leftPercent: 50,
  },
  fillSlots: [
    { segmentId: "roots_a" as WorldTreeSegmentId, yStart: 0, yEnd: 0.32, zIndex: 1 },
    {
      segmentId: "roots_b" as WorldTreeSegmentId,
      yStart: 0.06,
      yEnd: 0.4,
      xOffset: -7,
      zIndex: 2,
    },
    {
      segmentId: "roots_c" as WorldTreeSegmentId,
      yStart: 0.12,
      yEnd: 0.46,
      xOffset: 7,
      zIndex: 2,
    },
    {
      segmentId: "roots_d" as WorldTreeSegmentId,
      yStart: 0,
      yEnd: 0.24,
      widthPercent: 44,
      zIndex: 0,
    },
  ],
  gapTint: "#8B4A42",
} as const;
