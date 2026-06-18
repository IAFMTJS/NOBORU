import type { WorldTreeZoneId } from "@/features/journey/constants/world-tree-skeleton.constants";
import type { WorldTreeArtLayerRole } from "@/features/journey/constants/world-tree-zone-art.constants";

export type WorldTreeAscentLayerSpec = {
  section: string;
  role: WorldTreeArtLayerRole;
  start?: number;
  count?: number;
};

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
  skeletonZones: readonly WorldTreeZoneId[];
  heightPercent: number;
  backdrop: readonly WorldTreeAscentLayerSpec[];
  /** Sparse scenery — max 2 per realm to avoid sticker clutter. */
  decor: readonly WorldTreeRealmDecorSpec[];
  atmosphere: WorldTreeRealmAtmosphere;
};

export const WORLD_TREE_NODE_MIN_Y_GAP = 4.5;

export const WORLD_TREE_STRUCTURAL_SPAN = {
  yMin: 1,
  yMax: 99,
} as const;

/** Cap rendered height per puzzle piece so the full column fits the canvas. */
export const WORLD_TREE_PIECE_MAX_VH = 10.5;

export const WORLD_TREE_STACK_OVERLAP_FRACTION = 0.2;

/**
 * One continuous trunk column (bottom → top). Realms supply atmosphere/backdrop only.
 * Curated counts keep the stack readable — not every sheet cell at once.
 */
export const WORLD_TREE_GLOBAL_STRUCTURE: readonly WorldTreeAscentLayerSpec[] = [
  { section: "14_underground_root_passages", role: "roots", count: 2 },
  { section: "15_root_chambers_caverns", role: "roots", count: 2 },
  { section: "03_roots_bases", role: "roots", count: 6 },
  { section: "01_trunk_segments", role: "trunk" },
  { section: "02_branches_limbs", role: "branches", count: 5 },
] as const;

export const WORLD_TREE_REALMS: readonly WorldTreeRealmSpec[] = [
  {
    id: "deep_roots",
    label: "Deep Roots",
    skeletonZones: ["deep_roots", "n5_roots"],
    heightPercent: 18,
    backdrop: [{ section: "14_underground_root_passages", role: "background" }],
    decor: [
      { section: "20_underground_crystals", role: "overlay", count: 1, category: "special" },
    ],
    atmosphere: {
      light: { top: "#3d2850", mid: "#1a1228", bottom: "#0a0610" },
      dark: { top: "#2a1838", mid: "#0e0818", bottom: "#050308" },
    },
  },
  {
    id: "root_frontier",
    label: "Root Frontier",
    skeletonZones: ["n4_foothills"],
    heightPercent: 18,
    backdrop: [{ section: "13_background_composition", role: "background", start: 1, count: 3 }],
    decor: [
      { section: "04_platforms_ledges", role: "platform", count: 1, category: "settlement" },
    ],
    atmosphere: {
      light: { top: "#d8ccb8", mid: "#a89478", bottom: "#5c4838" },
      dark: { top: "#2a2218", mid: "#1a1610", bottom: "#0e0c08" },
    },
  },
  {
    id: "trunk_realm",
    label: "Trunk Realm",
    skeletonZones: ["n3_trunk_1", "n3_trunk_2", "n3_trunk_3"],
    heightPercent: 34,
    backdrop: [{ section: "13_background_composition", role: "background", start: 4, count: 5 }],
    decor: [
      { section: "08_camps_learning", role: "overlay", count: 1, category: "camp" },
      { section: "07_shrines_sacred", role: "overlay", count: 1, category: "shrine" },
    ],
    atmosphere: {
      light: { top: "#e8f0dc", mid: "#b8c8a4", bottom: "#8a9870" },
      dark: { top: "#1a2018", mid: "#141a14", bottom: "#0e120e" },
    },
  },
  {
    id: "canopy_realm",
    label: "Canopy Realm",
    skeletonZones: ["n2_canopy"],
    heightPercent: 15,
    backdrop: [{ section: "13_background_composition", role: "background", start: 9, count: 4 }],
    decor: [
      { section: "05_floating_islands", role: "platform", count: 2, category: "settlement" },
      { section: "11_nature_vegetation", role: "overlay", count: 1, category: "special" },
    ],
    atmosphere: {
      light: { top: "#f4f8f0", mid: "#d8e8c8", bottom: "#98b888" },
      dark: { top: "#1a201a", mid: "#141a16", bottom: "#101812" },
    },
  },
  {
    id: "celestial_spire",
    label: "Celestial Spire",
    skeletonZones: ["n1_celestial"],
    heightPercent: 15,
    backdrop: [{ section: "13_background_composition", role: "background", start: 13, count: 4 }],
    decor: [
      { section: "12_special_elements", role: "overlay", count: 1, category: "special" },
      { section: "05_floating_islands", role: "platform", start: 10, count: 1, category: "settlement" },
    ],
    atmosphere: {
      light: { top: "#faf8f4", mid: "#f0e8f0", bottom: "#d8c8e8" },
      dark: { top: "#201828", mid: "#181420", bottom: "#12101a" },
    },
  },
] as const;

export const WORLD_TREE_STRUCTURAL_ASCENT = WORLD_TREE_GLOBAL_STRUCTURE;
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
