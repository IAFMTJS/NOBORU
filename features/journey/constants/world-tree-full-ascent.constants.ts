import type { WorldTreeZoneId } from "@/features/journey/constants/world-tree-skeleton.constants";
import type { WorldTreeArtLayerRole } from "@/features/journey/constants/world-tree-zone-art.constants";

export type WorldTreeAscentLayerSpec = {
  section: string;
  role: WorldTreeArtLayerRole;
  /** 1-based index into the themed section list. */
  start?: number;
  /** Max pieces from start (default: all remaining). */
  count?: number;
};

/** Legend-aligned decor categories — inspired by reference maps, built from our sheet sections. */
export type WorldTreeDecorCategory =
  | "settlement"
  | "camp"
  | "shrine"
  | "bridge"
  | "special";

export type WorldTreeRealmId =
  | "deep_roots"
  | "root_frontier"
  | "trunk_realm"
  | "canopy_realm"
  | "celestial_spire";

export type WorldTreeRealmAtmosphere = {
  light: { top: string; mid: string; bottom: string };
  dark: { top: string; mid: string; bottom: string };
};

export type WorldTreeRealmDecorSpec = WorldTreeAscentLayerSpec & {
  category: WorldTreeDecorCategory;
};

export type WorldTreeRealmSpec = {
  id: WorldTreeRealmId;
  label: string;
  /** Skeleton zones whose lesson nodes live in this realm band. */
  skeletonZones: readonly WorldTreeZoneId[];
  /** Vertical share of the full canvas (must sum to 100). */
  heightPercent: number;
  /** Puzzle pieces that form the trunk column inside this band. Bottom → top order. */
  structural: readonly WorldTreeAscentLayerSpec[];
  /** Full-width atmospheric slices behind the column. */
  backdrop: readonly WorldTreeAscentLayerSpec[];
  /** Branch platforms, camps, shrines — integrated into the tree, not pasted on top. */
  decor: readonly WorldTreeRealmDecorSpec[];
  atmosphere: WorldTreeRealmAtmosphere;
};

/** Minimum vertical gap between journey nodes (% of canvas height). */
export const WORLD_TREE_NODE_MIN_Y_GAP = 3.8;

/** Vertical span reserved for the structural trunk column (% of canvas). */
export const WORLD_TREE_STRUCTURAL_SPAN = {
  yMin: 2,
  yMax: 98,
} as const;

/** Seam overlap between stack pieces as a fraction of each piece's rendered height. */
export const WORLD_TREE_STACK_OVERLAP_FRACTION = 0.18;

/**
 * Five-realm ascent model — design reference for vertical flow and asset grouping,
 * implemented with Noboru sheet-remasters (not a literal copy of any mockup).
 *
 * @see docs/World tree bible.md
 * @see Art Library/world-tree/ASSET_CHECKLIST.md
 */
export const WORLD_TREE_REALMS: readonly WorldTreeRealmSpec[] = [
  {
    id: "deep_roots",
    label: "Deep Roots",
    skeletonZones: ["deep_roots", "n5_roots"],
    heightPercent: 18,
    structural: [
      { section: "14_underground_root_passages", role: "roots" },
      { section: "15_root_chambers_caverns", role: "roots", count: 3 },
    ],
    backdrop: [{ section: "14_underground_root_passages", role: "background" }],
    decor: [
      { section: "20_underground_crystals", role: "overlay", count: 4, category: "special" },
      { section: "19_underground_fungi", role: "overlay", count: 4, category: "special" },
      { section: "21_underground_special", role: "overlay", count: 2, category: "special" },
      { section: "16_underground_platforms", role: "platform", count: 2, category: "settlement" },
    ],
    atmosphere: {
      light: { top: "#2a1838", mid: "#1a1228", bottom: "#0e0818" },
      dark: { top: "#1a1028", mid: "#0c0814", bottom: "#06040c" },
    },
  },
  {
    id: "root_frontier",
    label: "Root Frontier",
    skeletonZones: ["n4_foothills"],
    heightPercent: 18,
    structural: [
      { section: "03_roots_bases", role: "roots" },
      { section: "01_trunk_segments", role: "trunk", start: 1, count: 8 },
    ],
    backdrop: [{ section: "13_background_composition", role: "background", start: 1, count: 4 }],
    decor: [
      { section: "17_underground_settlements", role: "overlay", count: 3, category: "settlement" },
      { section: "04_platforms_ledges", role: "platform", count: 3, category: "settlement" },
      { section: "10_decorations_props", role: "overlay", count: 3, category: "special" },
      { section: "18_underground_props", role: "overlay", count: 1, category: "special" },
    ],
    atmosphere: {
      light: { top: "#c8b89a", mid: "#a89478", bottom: "#3d2e24" },
      dark: { top: "#2a2218", mid: "#1a1610", bottom: "#0e0c08" },
    },
  },
  {
    id: "trunk_realm",
    label: "Trunk Realm",
    skeletonZones: ["n3_trunk_1", "n3_trunk_2", "n3_trunk_3"],
    heightPercent: 34,
    structural: [{ section: "01_trunk_segments", role: "trunk", start: 9, count: 14 }],
    backdrop: [{ section: "13_background_composition", role: "background", start: 5, count: 8 }],
    decor: [
      { section: "08_camps_learning", role: "overlay", count: 5, category: "camp" },
      { section: "04_platforms_ledges", role: "platform", start: 4, count: 4, category: "settlement" },
      { section: "07_shrines_sacred", role: "overlay", count: 5, category: "shrine" },
      { section: "09_bridges_connections", role: "overlay", category: "bridge" },
      { section: "10_decorations_props", role: "overlay", start: 4, count: 4, category: "special" },
    ],
    atmosphere: {
      light: { top: "#dce8d0", mid: "#b8c8a4", bottom: "#8a9870" },
      dark: { top: "#1a2018", mid: "#141a14", bottom: "#0e120e" },
    },
  },
  {
    id: "canopy_realm",
    label: "Canopy Realm",
    skeletonZones: ["n2_canopy"],
    heightPercent: 15,
    structural: [
      { section: "01_trunk_segments", role: "trunk", start: 23, count: 8 },
      { section: "02_branches_limbs", role: "branches", count: 5 },
    ],
    backdrop: [{ section: "13_background_composition", role: "background", start: 13, count: 5 }],
    decor: [
      { section: "05_floating_islands", role: "platform", count: 7, category: "settlement" },
      { section: "11_nature_vegetation", role: "overlay", count: 5, category: "special" },
      { section: "07_shrines_sacred", role: "overlay", start: 6, count: 4, category: "shrine" },
      { section: "09_bridges_connections", role: "overlay", category: "bridge" },
    ],
    atmosphere: {
      light: { top: "#f0ece4", mid: "#d8e8c8", bottom: "#98b888" },
      dark: { top: "#1a201a", mid: "#141a16", bottom: "#101812" },
    },
  },
  {
    id: "celestial_spire",
    label: "Celestial Spire",
    skeletonZones: ["n1_celestial"],
    heightPercent: 15,
    structural: [
      { section: "01_trunk_segments", role: "trunk", start: 31, count: 3 },
      { section: "02_branches_limbs", role: "branches", start: 6, count: 3 },
    ],
    backdrop: [{ section: "13_background_composition", role: "background", start: 18, count: 5 }],
    decor: [
      { section: "05_floating_islands", role: "platform", start: 8, count: 8, category: "settlement" },
      { section: "12_special_elements", role: "overlay", category: "special" },
      { section: "11_nature_vegetation", role: "overlay", start: 6, count: 5, category: "special" },
      { section: "07_shrines_sacred", role: "overlay", start: 11, count: 3, category: "shrine" },
    ],
    atmosphere: {
      light: { top: "#faf8f4", mid: "#f0e8f0", bottom: "#d8c8e8" },
      dark: { top: "#201828", mid: "#181420", bottom: "#12101a" },
    },
  },
] as const;

/** @deprecated Use WORLD_TREE_REALMS — kept for tests that assert zone-level art maps. */
export const WORLD_TREE_STRUCTURAL_ASCENT = WORLD_TREE_REALMS.flatMap((realm) => realm.structural);

export const WORLD_TREE_BACKDROP_ASCENT = WORLD_TREE_REALMS.flatMap((realm) => realm.backdrop);

export function buildWorldTreeRealmBands(): Record<
  WorldTreeRealmId,
  { yMin: number; yMax: number }
> {
  let cursor = 100;
  const bands = {} as Record<WorldTreeRealmId, { yMin: number; yMax: number }>;

  for (const realm of WORLD_TREE_REALMS) {
    const yMax = cursor;
    const yMin = cursor - realm.heightPercent;
    bands[realm.id] = { yMin, yMax };
    cursor = yMin;
  }

  return bands;
}

export function resolveRealmForZone(zoneId: WorldTreeZoneId): WorldTreeRealmId {
  for (const realm of WORLD_TREE_REALMS) {
    if (realm.skeletonZones.includes(zoneId)) return realm.id;
  }
  return "trunk_realm";
}
