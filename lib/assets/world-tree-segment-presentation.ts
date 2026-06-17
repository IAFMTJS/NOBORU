import {
  WORLD_TREE_SEAM_OVERLAP_PERCENT,
  WORLD_TREE_TILE_BASES,
  type WorldTreeTileBase,
} from "@/lib/assets/art-library-paths";

/** Native tile canvas from world-tree-manifest.json. */
export const WORLD_TREE_TILE_CANVAS = {
  width: 1536,
  height: 1024,
  aspectRatio: 1536 / 1024,
  targetTrunkWidthPercent: 28,
} as const;

/**
 * CSS margin-top % is width-relative. Convert seam overlap (px @ tile height)
 * into the correct width-percent for stacked 1536×1024 tiles.
 */
export const WORLD_TREE_OVERLAP_WIDTH_PERCENT =
  (WORLD_TREE_TILE_CANVAS.height / WORLD_TREE_TILE_CANVAS.width) *
  (WORLD_TREE_SEAM_OVERLAP_PERCENT / 100) *
  100;

export type WorldTreeSegmentPresentation = {
  trunkCenterXPercent: number;
  /** Opaque painted width from alpha analysis — not the PNG file box alone. */
  opaqueWidthPercent: number;
  /** Zoom to normalize trunk column width across heterogeneous puzzle art. */
  presentationScale: number;
};

const SEGMENT_ID_BY_TILE_BASE = Object.fromEntries(
  Object.entries(WORLD_TREE_TILE_BASES).map(([segmentId, base]) => [base, segmentId]),
) as Record<WorldTreeTileBase, string>;

/** Alpha-bbox analysis of v2 dark masters — update when art is regenerated. */
const RAW_SEGMENT_BOUNDS: Record<
  string,
  Pick<WorldTreeSegmentPresentation, "trunkCenterXPercent" | "opaqueWidthPercent">
> = {
  roots_a: { trunkCenterXPercent: 49.9, opaqueWidthPercent: 69.6 },
  roots_b: { trunkCenterXPercent: 50.0, opaqueWidthPercent: 42.4 },
  roots_c: { trunkCenterXPercent: 50.0, opaqueWidthPercent: 42.4 },
  roots_d: { trunkCenterXPercent: 50.0, opaqueWidthPercent: 42.4 },
  roots_e: { trunkCenterXPercent: 50.0, opaqueWidthPercent: 34.2 },
  trunk_a: { trunkCenterXPercent: 50.2, opaqueWidthPercent: 40.6 },
  trunk_b: { trunkCenterXPercent: 49.5, opaqueWidthPercent: 50.4 },
  trunk_c: { trunkCenterXPercent: 50.0, opaqueWidthPercent: 40.6 },
  trunk_d: { trunkCenterXPercent: 50.1, opaqueWidthPercent: 46.7 },
  trunk_e: { trunkCenterXPercent: 50.0, opaqueWidthPercent: 34.4 },
  trunk_f: { trunkCenterXPercent: 50.0, opaqueWidthPercent: 40.6 },
  trunk_g: { trunkCenterXPercent: 50.0, opaqueWidthPercent: 39.5 },
  trunk_h: { trunkCenterXPercent: 49.8, opaqueWidthPercent: 29.2 },
  transition_ancient_to_canopy: { trunkCenterXPercent: 51.3, opaqueWidthPercent: 44.3 },
};

const DEFAULT_PRESENTATION: WorldTreeSegmentPresentation = {
  trunkCenterXPercent: 50,
  opaqueWidthPercent: 40,
  presentationScale: 1,
};

function buildPresentationScale(opaqueWidthPercent: number): number {
  const raw = opaqueWidthPercent / WORLD_TREE_TILE_CANVAS.targetTrunkWidthPercent;
  return Math.min(3.6, Math.max(0.9, raw));
}

export const WORLD_TREE_SEGMENT_PRESENTATION: Record<string, WorldTreeSegmentPresentation> =
  Object.fromEntries(
    Object.entries(RAW_SEGMENT_BOUNDS).map(([id, bounds]) => [
      id,
      {
        ...bounds,
        presentationScale: buildPresentationScale(bounds.opaqueWidthPercent),
      },
    ]),
  );

export function segmentIdFromTileBase(base: WorldTreeTileBase): string {
  return SEGMENT_ID_BY_TILE_BASE[base] ?? base.split("/").slice(-2, -1)[0] ?? base;
}

export function resolveWorldTreeSegmentPresentation(
  base: WorldTreeTileBase,
): WorldTreeSegmentPresentation {
  const segmentId = segmentIdFromTileBase(base);
  return WORLD_TREE_SEGMENT_PRESENTATION[segmentId] ?? DEFAULT_PRESENTATION;
}

/** True when art fills nearly the entire tile — needs regen as a transparent puzzle piece. */
export function isFullBleedWorldTreeSegment(base: WorldTreeTileBase): boolean {
  const { opaqueWidthPercent } = resolveWorldTreeSegmentPresentation(base);
  return opaqueWidthPercent >= 90;
}
