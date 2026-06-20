import type {
  WorldTreeJlptHeroAnchor,
  WorldTreeSegmentId,
  WorldTreeTransitionId,
} from "@/features/journey/constants/world-tree-jlpt-segment.constants";

/** Published hero art version — see Art Library/world-tree/worlds/n4/WORLD_ART_SPEC.md */
export const N4_HERO_ART_VERSION = 2 as const;

/** N4 full-canvas art tuning — band-local coords (0 = base, 1 = crown). */
export const N4_WORLD_ART_SPEC = {
  trunkCenterX: 50,
  hero: {
    anchor: "bottom" as WorldTreeJlptHeroAnchor,
    yStart: 0,
    yEnd: 0.96,
    scale: 1.52,
    widthPercent: 150,
    leftPercent: 50,
  },
  /** Amber foothills atmosphere below the hero mass. */
  worldHeartBase: {
    heightPercent: 28,
    goldenGlow: "#E8A317",
    rootMist: "#3D3018",
    earthTone: "#101820",
  },
  islandFringeOverlay: {
    heightPercent: 14,
    color: "#101820",
  },
  islandSeamOverlay: {
    heightPercent: 22,
    color: "#2A2010",
  },
  /** Masks pink-purple crown fringe on hero PNG (portal zone). */
  crownSeamOverlay: {
    heightPercent: 10,
    mistColor: "#9B4A8B",
    fadeColor: "#101820",
  },
  fillSlots: [
    { segmentId: "roots_e" as WorldTreeSegmentId, yStart: 0, yEnd: 0.38, zIndex: 1, widthPercent: 58 },
    {
      segmentId: "trunk_a" as WorldTreeSegmentId,
      yStart: 0.02,
      yEnd: 0.5,
      xOffset: -12,
      zIndex: 2,
      widthPercent: 46,
    },
    {
      segmentId: "trunk_b" as WorldTreeSegmentId,
      yStart: 0.08,
      yEnd: 0.56,
      xOffset: 12,
      zIndex: 2,
      widthPercent: 46,
    },
    {
      segmentId: "trunk_c" as WorldTreeSegmentId,
      yStart: 0.32,
      yEnd: 0.82,
      xOffset: 4,
      zIndex: 1,
      widthPercent: 54,
    },
    {
      segmentId: "transition_root_to_trunk" as WorldTreeTransitionId,
      yStart: 0.88,
      yEnd: 1,
      widthPercent: 62,
      zIndex: 3,
    },
  ],
  gapTint: "#8B6B2E",
  seamMistTint: "#9B4A8B",
} as const;
