import type { WorldTreeJlptBandId } from "@/features/journey/constants/world-tree-jlpt-band.constants";

export type WorldTreeSegmentId =
  | "roots_a"
  | "roots_b"
  | "roots_c"
  | "roots_d"
  | "roots_e"
  | "trunk_a"
  | "trunk_b"
  | "trunk_c"
  | "trunk_d"
  | "trunk_e"
  | "trunk_f"
  | "trunk_g"
  | "trunk_h";

export type WorldTreeTransitionId =
  | "transition_root_to_trunk"
  | "transition_ancient_to_canopy";

export type WorldTreeJlptHeroAnchor = "bottom" | "center" | "top";

export type WorldTreeJlptBandArtSpec = {
  /** Puzzle pieces stacked bottom→top within this JLPT band. */
  fillSegments: readonly WorldTreeSegmentId[];
  /** Hero floating-island art vertical anchor within the band. */
  heroAnchor: WorldTreeJlptHeroAnchor;
  /** Transition piece at the top seam (into the band above). */
  transitionTop?: WorldTreeTransitionId;
};

/**
 * Five JLPT bands — fill art + hero placement.
 * Heroes sit on the trunk column; fill segments tile the band gaps.
 */
export const WORLD_TREE_JLPT_BAND_ART: Record<WorldTreeJlptBandId, WorldTreeJlptBandArtSpec> = {
  n5: {
    fillSegments: ["roots_a", "roots_b", "roots_c", "roots_d"],
    heroAnchor: "bottom",
  },
  n4: {
    fillSegments: ["roots_e", "trunk_a", "trunk_b", "trunk_c"],
    heroAnchor: "bottom",
  },
  n3: {
    fillSegments: ["trunk_c", "trunk_d", "trunk_e", "trunk_f"],
    heroAnchor: "center",
  },
  n2: {
    fillSegments: ["trunk_g", "trunk_h"],
    heroAnchor: "top",
    transitionTop: "transition_ancient_to_canopy",
  },
  n1: {
    fillSegments: [],
    heroAnchor: "top",
  },
};

/** Continuous trunk column — bottom (roots) → top (crown). */
export const WORLD_TREE_STRUCTURAL_COLUMN: readonly WorldTreeSegmentId[] = [
  "roots_a",
  "roots_b",
  "roots_c",
  "roots_d",
  "roots_e",
  "trunk_a",
  "trunk_b",
  "trunk_c",
  "trunk_d",
  "trunk_e",
  "trunk_f",
  "trunk_g",
  "trunk_h",
];

export const WORLD_TREE_SEGMENT_ART_ROOT = "world-tree/segments";
export const WORLD_TREE_TRANSITION_ART_ROOT = "world-tree/transitions";

export function worldTreeSegmentArtPath(
  segmentId: WorldTreeSegmentId | WorldTreeTransitionId,
  theme: "light" | "dark",
  version = 2,
): string {
  if (segmentId.startsWith("transition_")) {
    const transitionFolder = segmentId.slice("transition_".length);
    return `${WORLD_TREE_TRANSITION_ART_ROOT}/${transitionFolder}/wt_${segmentId}_${theme}_v${version}.png`;
  }
  return `${WORLD_TREE_SEGMENT_ART_ROOT}/${segmentId}/wt_${segmentId}_${theme}_v${version}.png`;
}

export function resolveHeroObjectPosition(anchor: WorldTreeJlptHeroAnchor): string {
  switch (anchor) {
    case "bottom":
      return "center bottom";
    case "top":
      return "center top";
    default:
      return "center center";
  }
}
