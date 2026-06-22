/**
 * Underground extension below the World Tree base (y=100).
 * Uses 01_roots banner + sheet-remaster cavern/roots art.
 *
 * @see docs/Skeleton world tree.md — Deep Root Network
 * @see features/journey/constants/world-tree-zone-art.constants.ts
 */

/** Underground block height as a fraction of the main tree canvas (vh). */
export const WORLD_TREE_UNDERGROUND_HEIGHT_RATIO = 0.18;

export const WORLD_TREE_UNDERGROUND_ART_ROOT = "world-tree/01_roots";

export function worldTreeRootsBannerPath(theme: "light" | "dark", version = 2): string {
  return `${WORLD_TREE_UNDERGROUND_ART_ROOT}/wt_roots_${theme}_v${version}.png`;
}

/** Deep cavern atmosphere — always reads as subterranean. */
export const WORLD_TREE_UNDERGROUND_ATMOSPHERE = {
  light: {
    top: "#2a1838",
    mid: "#120a18",
    bottom: "#060308",
  },
  dark: {
    top: "#1a1028",
    mid: "#0a0612",
    bottom: "#030208",
  },
} as const;

export type WorldTreeUndergroundLayerSpec = {
  section: string;
  count: number;
  role: "passage" | "chamber" | "fungi" | "crystal" | "platform";
};

/** Curated underground puzzle pieces — readable, not every sheet cell. */
export const WORLD_TREE_UNDERGROUND_LAYERS: readonly WorldTreeUndergroundLayerSpec[] = [
  { section: "14_underground_root_passages", count: 3, role: "passage" },
  { section: "15_root_chambers_caverns", count: 2, role: "chamber" },
  { section: "16_underground_platforms", count: 2, role: "platform" },
  { section: "19_underground_fungi", count: 4, role: "fungi" },
  { section: "20_underground_crystals", count: 3, role: "crystal" },
] as const;
