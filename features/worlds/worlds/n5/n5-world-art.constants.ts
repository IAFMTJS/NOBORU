import type {
  WorldTreeJlptHeroAnchor,
  WorldTreeSegmentId,
} from "@/features/journey/constants/world-tree-jlpt-segment.constants";

/** N5 full-canvas art tuning — band-local coords (0 = base, 1 = crown). */
export const N5_WORLD_ART_SPEC = {
  trunkCenterX: 50,
  hero: {
    anchor: "bottom" as WorldTreeJlptHeroAnchor,
    yStart: 0,
    yEnd: 0.94,
    scale: 1.52,
    widthPercent: 148,
    leftPercent: 50,
  },
  fillSlots: [
    { segmentId: "roots_a" as WorldTreeSegmentId, yStart: 0, yEnd: 0.36, zIndex: 1, widthPercent: 52 },
    {
      segmentId: "roots_b" as WorldTreeSegmentId,
      yStart: 0.04,
      yEnd: 0.44,
      xOffset: -14,
      zIndex: 2,
      widthPercent: 46,
    },
    {
      segmentId: "roots_c" as WorldTreeSegmentId,
      yStart: 0.1,
      yEnd: 0.5,
      xOffset: 14,
      zIndex: 2,
      widthPercent: 46,
    },
    {
      segmentId: "roots_d" as WorldTreeSegmentId,
      yStart: 0,
      yEnd: 0.28,
      widthPercent: 58,
      zIndex: 0,
    },
  ],
  gapTint: "#8B4A42",
} as const;
