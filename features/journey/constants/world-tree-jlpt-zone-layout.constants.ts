import type { WorldTreeJlptBandId } from "@/features/journey/constants/world-tree-jlpt-band.constants";
import type {
  WorldTreeJlptHeroAnchor,
  WorldTreeSegmentId,
} from "@/features/journey/constants/world-tree-jlpt-segment.constants";

/** Vertical slot within a JLPT band (0 = band base, 1 = band crown). */
export type JlptBandFillSlot = {
  segmentId: WorldTreeSegmentId;
  /** Band-local start (0–1, bottom→top). */
  yStart: number;
  /** Band-local end (0–1). */
  yEnd: number;
  /** Width as % of viewport; default from trunk manifest. */
  widthPercent?: number;
  /** Horizontal center offset from trunk axis. */
  xOffset?: number;
  zIndex?: number;
};

export type WorldTreeJlptZoneLayoutSpec = {
  /** Main spine X for nodes + trunk column in this band. */
  trunkCenterX: number;
  /** Max horizontal sway for spine path (percent). */
  pathSway: number;
  hero: {
    anchor: WorldTreeJlptHeroAnchor;
    /** Band-local vertical range the hero island occupies. */
    yStart: number;
    yEnd: number;
    scale: number;
  };
  /** Puzzle pieces tiling gaps around / between hero zones. */
  fillSlots: readonly JlptBandFillSlot[];
  /** Procedural gap mist tint (hex). */
  gapTint: string;
};

/**
 * Per-JLPT zone art + spine tuning — tuned to hero PNG composition.
 * yStart/yEnd are band-local: 0 = bottom of band, 1 = top.
 */
export const WORLD_TREE_JLPT_ZONE_LAYOUT: Record<
  WorldTreeJlptBandId,
  WorldTreeJlptZoneLayoutSpec
> = {
  n5: {
    trunkCenterX: 50,
    pathSway: 1.2,
    hero: { anchor: "bottom", yStart: 0.08, yEnd: 1, scale: 1.12 },
    fillSlots: [
      { segmentId: "roots_a", yStart: 0, yEnd: 0.48, zIndex: 1 },
      { segmentId: "roots_b", yStart: 0.1, yEnd: 0.58, xOffset: -10, zIndex: 2 },
      { segmentId: "roots_c", yStart: 0.16, yEnd: 0.64, xOffset: 10, zIndex: 2 },
      { segmentId: "roots_d", yStart: 0.02, yEnd: 0.4, widthPercent: 42, zIndex: 0 },
      { segmentId: "roots_e", yStart: 0.28, yEnd: 0.78, widthPercent: 44, zIndex: 1 },
      { segmentId: "roots_d", yStart: 0.55, yEnd: 0.92, xOffset: -6, widthPercent: 36, zIndex: 1 },
    ],
    gapTint: "#8B4A42",
  },
  n4: {
    trunkCenterX: 50,
    pathSway: 1.4,
    hero: { anchor: "center", yStart: 0.06, yEnd: 0.98, scale: 1.08 },
    fillSlots: [
      { segmentId: "roots_e", yStart: 0, yEnd: 0.38, zIndex: 1 },
      { segmentId: "trunk_a", yStart: 0.08, yEnd: 0.55, zIndex: 2 },
      { segmentId: "trunk_b", yStart: 0.42, yEnd: 0.92, xOffset: -4, zIndex: 3 },
      { segmentId: "trunk_a", yStart: 0.55, yEnd: 1, xOffset: 5, zIndex: 1 },
      { segmentId: "trunk_c", yStart: 0.66, yEnd: 1, widthPercent: 40, zIndex: 2 },
    ],
    gapTint: "#8B6B2E",
  },
  n3: {
    trunkCenterX: 50,
    pathSway: 1.6,
    hero: { anchor: "center", yStart: 0.06, yEnd: 0.98, scale: 1.1 },
    fillSlots: [
      { segmentId: "trunk_c", yStart: 0, yEnd: 0.45, zIndex: 1 },
      { segmentId: "trunk_d", yStart: 0.15, yEnd: 0.58, zIndex: 2 },
      { segmentId: "trunk_e", yStart: 0.38, yEnd: 0.78, xOffset: -3, zIndex: 3 },
      { segmentId: "trunk_f", yStart: 0.55, yEnd: 1, zIndex: 2 },
      { segmentId: "trunk_g", yStart: 0.62, yEnd: 1, xOffset: 4, zIndex: 1 },
    ],
    gapTint: "#3D6B3A",
  },
  n2: {
    trunkCenterX: 50,
    pathSway: 1.5,
    hero: { anchor: "top", yStart: 0, yEnd: 0.92, scale: 1.1 },
    fillSlots: [
      { segmentId: "canopy_a", yStart: 0.18, yEnd: 0.62, zIndex: 2 },
      { segmentId: "canopy_b", yStart: 0.08, yEnd: 0.52, xOffset: -6, zIndex: 3 },
      { segmentId: "canopy_c", yStart: 0.35, yEnd: 0.82, xOffset: 5, zIndex: 2 },
      { segmentId: "canopy_d", yStart: 0.55, yEnd: 0.98, zIndex: 1 },
      { segmentId: "canopy_e", yStart: 0.72, yEnd: 1, xOffset: 4, zIndex: 0 },
      { segmentId: "canopy_c", yStart: 0.78, yEnd: 1, widthPercent: 42, zIndex: 1 },
    ],
    gapTint: "#3A6B8B",
  },
  n1: {
    trunkCenterX: 50,
    pathSway: 1.1,
    hero: { anchor: "top", yStart: 0, yEnd: 0.98, scale: 1.12 },
    fillSlots: [
      { segmentId: "celestial_a", yStart: 0.42, yEnd: 0.88, zIndex: 2 },
      { segmentId: "celestial_b", yStart: 0.22, yEnd: 0.68, xOffset: -5, zIndex: 3 },
      { segmentId: "celestial_c", yStart: 0.08, yEnd: 0.55, zIndex: 2 },
      { segmentId: "celestial_d", yStart: 0, yEnd: 0.38, xOffset: 6, zIndex: 1 },
      { segmentId: "celestial_b", yStart: 0.62, yEnd: 0.98, widthPercent: 44, zIndex: 1 },
    ],
    gapTint: "#5A4A8B",
  },
};

export function resolveJlptZoneSpec(bandId: WorldTreeJlptBandId): WorldTreeJlptZoneLayoutSpec {
  return WORLD_TREE_JLPT_ZONE_LAYOUT[bandId];
}

export function resolveJlptZoneTrunkX(
  bandId: WorldTreeJlptBandId,
  progressInBand: number,
  nodeIndex: number,
): number {
  const spec = resolveJlptZoneSpec(bandId);
  const wave = Math.sin(progressInBand * Math.PI * 1.2 + nodeIndex * 0.07) * spec.pathSway;
  const stagger = (nodeIndex % 2 === 0 ? 1 : -1) * 0.5;
  return spec.trunkCenterX + wave + stagger;
}
