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
    yEnd: 0.96,
    scale: 1.55,
    widthPercent: 152,
    leftPercent: 50,
  },
  /** World Heart atmosphere below the island — hides the canvas void. */
  worldHeartBase: {
    heightPercent: 28,
    goldenGlow: "#D4A843",
    rootMist: "#3D2818",
    earthTone: "#1A0F0A",
  },
  /** Post-hero overlay — masks purple PNG fringe at the island underhang (canvas bottom). */
  islandFringeOverlay: {
    heightPercent: 14,
    color: "#1A0F0A",
  },
  /** Warm transition from island mass into World Heart roots. */
  islandSeamOverlay: {
    heightPercent: 22,
    color: "#2A1810",
  },
  fillSlots: [
    { segmentId: "roots_a" as WorldTreeSegmentId, yStart: 0, yEnd: 0.42, zIndex: 1, widthPercent: 62 },
    {
      segmentId: "roots_b" as WorldTreeSegmentId,
      yStart: 0.02,
      yEnd: 0.48,
      xOffset: -16,
      zIndex: 2,
      widthPercent: 50,
    },
    {
      segmentId: "roots_c" as WorldTreeSegmentId,
      yStart: 0.08,
      yEnd: 0.54,
      xOffset: 16,
      zIndex: 2,
      widthPercent: 50,
    },
    {
      segmentId: "roots_d" as WorldTreeSegmentId,
      yStart: 0,
      yEnd: 0.32,
      widthPercent: 68,
      zIndex: 0,
    },
  ],
  gapTint: "#6B3E2E",
  seamBlendTint: "#4A3020",
} as const;
