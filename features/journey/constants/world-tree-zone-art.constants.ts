import type { WorldTreeZoneId } from "@/features/journey/constants/world-tree-skeleton.constants";

export type WorldTreeArtLayerRole =
  | "background"
  | "trunk"
  | "roots"
  | "branches"
  | "platform"
  | "overlay";

export type WorldTreeZoneArtLayer = {
  section: string;
  role: WorldTreeArtLayerRole;
  /** 1-based index into the themed section list. */
  start?: number;
  /** Max pieces from start (default: all remaining). */
  count?: number;
};

export type WorldTreeZoneArtConfig = {
  layers: readonly WorldTreeZoneArtLayer[];
};

/**
 * Maps skeleton zones → sheet-remaster sections (261 puzzle pieces).
 * Bottom (roots) → top (crown).
 */
export const WORLD_TREE_ZONE_ART: Record<WorldTreeZoneId, WorldTreeZoneArtConfig> = {
  deep_roots: {
    layers: [
      { section: "14_underground_root_passages", role: "background" },
      { section: "15_root_chambers_caverns", role: "overlay", count: 2 },
      { section: "18_underground_props", role: "overlay" },
    ],
  },
  n5_roots: {
    layers: [
      { section: "03_roots_bases", role: "roots" },
      { section: "14_underground_root_passages", role: "background" },
      { section: "15_root_chambers_caverns", role: "platform", count: 3 },
      { section: "16_underground_platforms", role: "platform", count: 4 },
      { section: "17_underground_settlements", role: "overlay", count: 4 },
      { section: "19_underground_fungi", role: "overlay", count: 6 },
      { section: "20_underground_crystals", role: "overlay", count: 4 },
      { section: "21_underground_special", role: "overlay", count: 4 },
    ],
  },
  n4_foothills: {
    layers: [
      { section: "13_background_composition", role: "background", start: 1, count: 4 },
      { section: "01_trunk_segments", role: "trunk", start: 1, count: 8 },
      { section: "03_roots_bases", role: "roots", start: 1, count: 2 },
      { section: "04_platforms_ledges", role: "platform", count: 4 },
      { section: "08_camps_learning", role: "overlay", count: 5 },
      { section: "10_decorations_props", role: "overlay", count: 5 },
    ],
  },
  n3_trunk_1: {
    layers: [
      { section: "13_background_composition", role: "background", start: 5, count: 3 },
      { section: "01_trunk_segments", role: "trunk", start: 9, count: 6 },
      { section: "04_platforms_ledges", role: "platform", start: 5, count: 4 },
      { section: "07_shrines_sacred", role: "overlay", count: 5 },
      { section: "09_bridges_connections", role: "overlay" },
    ],
  },
  n3_trunk_2: {
    layers: [
      { section: "13_background_composition", role: "background", start: 8, count: 3 },
      { section: "01_trunk_segments", role: "trunk", start: 15, count: 6 },
      { section: "07_shrines_sacred", role: "overlay", start: 6, count: 6 },
      { section: "10_decorations_props", role: "overlay", start: 6, count: 5 },
    ],
  },
  n3_trunk_3: {
    layers: [
      { section: "13_background_composition", role: "background", start: 11, count: 3 },
      { section: "01_trunk_segments", role: "trunk", start: 21, count: 7 },
      { section: "07_shrines_sacred", role: "overlay", start: 12, count: 6 },
      { section: "11_nature_vegetation", role: "overlay", count: 6 },
    ],
  },
  n2_canopy: {
    layers: [
      { section: "13_background_composition", role: "background", start: 14, count: 4 },
      { section: "02_branches_limbs", role: "branches" },
      { section: "01_trunk_segments", role: "trunk", start: 28, count: 6 },
      { section: "05_floating_islands", role: "platform", count: 10 },
      { section: "11_nature_vegetation", role: "overlay", start: 7, count: 8 },
    ],
  },
  n1_celestial: {
    layers: [
      { section: "13_background_composition", role: "background", start: 18, count: 5 },
      { section: "05_floating_islands", role: "platform", start: 11, count: 11 },
      { section: "12_special_elements", role: "overlay" },
      { section: "11_nature_vegetation", role: "overlay", start: 15, count: 6 },
      { section: "10_decorations_props", role: "overlay", start: 11, count: 6 },
    ],
  },
};
