import type { JlptLevel } from "@/lib/content/types";
import type { RegionSlug } from "@/lib/design-system/regions";
import { WORLD_TREE_SEAM_OVERLAP_PERCENT } from "@/lib/assets/art-library-paths";

/**
 * Authoritative World Tree skeleton from docs/Skeleton world tree.md.
 * Art tiles attach to zones; lesson nodes plot on the trunk corridor.
 *
 * @see Art Library/world-tree/sheet-extracts/
 * @see docs/World tree bible.md
 */

export const WORLD_TREE_MANIFEST_ANCHORS = {
  trunkCenterXPercent: 50,
  trunkWidthPercent: 28,
  pathCorridorWidthPercent: 32,
  seamOverlapPercent: WORLD_TREE_SEAM_OVERLAP_PERCENT,
} as const;

export type WorldTreeZoneId =
  | "deep_roots"
  | "n5_roots"
  | "n4_foothills"
  | "n3_trunk_1"
  | "n3_trunk_2"
  | "n3_trunk_3"
  | "n2_canopy"
  | "n1_celestial";

export type WorldTreeZone = {
  id: WorldTreeZoneId;
  jlptLevel: JlptLevel | "deep";
  label: string;
  /** Share of total skeleton height (must sum to 100). */
  heightPercent: number;
};

/** Bottom → top ascent bands. y=100 is journey start, y=0 is crown. */
export const WORLD_TREE_SKELETON_ZONES: readonly WorldTreeZone[] = [
  {
    id: "deep_roots",
    jlptLevel: "deep",
    label: "Deep Root Network",
    heightPercent: 4,
  },
  {
    id: "n5_roots",
    jlptLevel: "n5",
    label: "N5 Roots",
    heightPercent: 14,
  },
  {
    id: "n4_foothills",
    jlptLevel: "n4",
    label: "N4 Foothills",
    heightPercent: 18,
  },
  {
    id: "n3_trunk_1",
    jlptLevel: "n3",
    label: "N3 Trunk · Ring I",
    heightPercent: 12,
  },
  {
    id: "n3_trunk_2",
    jlptLevel: "n3",
    label: "N3 Trunk · Ring II",
    heightPercent: 12,
  },
  {
    id: "n3_trunk_3",
    jlptLevel: "n3",
    label: "N3 Trunk · Ring III",
    heightPercent: 10,
  },
  {
    id: "n2_canopy",
    jlptLevel: "n2",
    label: "N2 Canopy",
    heightPercent: 15,
  },
  {
    id: "n1_celestial",
    jlptLevel: "n1",
    label: "N1 Celestial Crown",
    heightPercent: 15,
  },
] as const;

/** Virtual canvas height reserved for the full skeleton (future art stacks upward). */
export const WORLD_TREE_SKELETON_VH_PER_PERCENT = 6;
export const WORLD_TREE_SKELETON_MIN_HEIGHT_VH =
  WORLD_TREE_SKELETON_ZONES.reduce((sum, zone) => sum + zone.heightPercent, 0) *
  WORLD_TREE_SKELETON_VH_PER_PERCENT;

/** Max nodes on the main spine within one zone before overflow branches to caves. */
export const WORLD_TREE_MAX_MAIN_SPINE_NODES = 28;

/** Minimum vertical gap between nodes (legacy layout spacing — normalized Y uses 0–100%). */
export const WORLD_TREE_NODE_MIN_Y_GAP = 5.5;

/** Target vertical gap between nodes in vh (touch-friendly, works with normalized Y 0–100%). */
export const WORLD_TREE_MIN_NODE_GAP_VH = 8;

/** Horizontal gap between lessons on the same branch limb (% of canvas width). */
export const WORLD_TREE_MIN_BRANCH_X_GAP_PERCENT = 5.5;

/**
 * Maps app region slugs to their primary skeleton zone.
 * @see docs/Skeleton world tree.md — Region → Zone mapping
 */
export const REGION_SLUG_TO_WORLD_TREE_ZONE: Partial<
  Record<RegionSlug, WorldTreeZoneId>
> = {
  foothills: "deep_roots",
  "forest-trail": "n5_roots",
  "mount-n5": "n5_roots",
  "mount-n4": "n4_foothills",
  "mount-n3": "n3_trunk_1",
  "mount-n2": "n2_canopy",
  "mount-n1": "n1_celestial",
  "master-summit": "n1_celestial",
};

/** N3 spans three trunk rings — resolved by unit index at layout time. */
export const MOUNT_N3_TRUNK_ZONES: readonly WorldTreeZoneId[] = [
  "n3_trunk_1",
  "n3_trunk_2",
  "n3_trunk_3",
] as const;

export const DEFAULT_WORLD_TREE_ZONE: WorldTreeZoneId = "deep_roots";

/**
 * Resolves skeleton zone for a node — handles forest-trail split and N3 rings.
 */
export function resolveWorldTreeZoneForNode(
  regionSlug: string,
  nodeIndexInRegion: number,
  totalNodesInRegion: number,
  unitOrderIndex?: number,
): WorldTreeZoneId {
  if (regionSlug === "foothills") return "deep_roots";

  if (regionSlug === "forest-trail") {
    const midpoint = Math.floor(totalNodesInRegion / 2);
    return nodeIndexInRegion < midpoint ? "deep_roots" : "n5_roots";
  }

  if (regionSlug === "mount-n3" && unitOrderIndex != null) {
    const ringIndex = Math.min(Math.floor(unitOrderIndex / 4), 2);
    return MOUNT_N3_TRUNK_ZONES[ringIndex] ?? "n3_trunk_1";
  }

  return (
    REGION_SLUG_TO_WORLD_TREE_ZONE[regionSlug as RegionSlug] ??
    DEFAULT_WORLD_TREE_ZONE
  );
}
