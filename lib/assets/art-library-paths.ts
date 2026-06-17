/** Build URLs for published WebP assets under public/art-library/. */

export const ART_LIBRARY_PUBLIC_ROOT = "/art-library";

export type ArtLibraryTheme = "light" | "dark";

/**
 * Map Art Library source filenames (PNG/JPEG masters) to published WebP paths.
 * Masters in Art Library/ are not served on the site.
 */
export function artLibraryPublishedRelativePath(relativePath: string): string {
  return relativePath.replace(/\.(png|jpe?g)$/i, ".webp");
}

/** e.g. artLibraryPath("icons/icon_nav_journey_mountain_light_v1.png") → /art-library/...webp */
export function artLibraryPath(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const relative = normalized
    .replace(/^api\/art-library\//, "")
    .replace(/^art-library\//, "");
  const published = artLibraryPublishedRelativePath(relative);
  return `${ART_LIBRARY_PUBLIC_ROOT}/${published.split("/").map(encodeURIComponent).join("/")}`;
}

/** Swap _light_ / _dark_ in a versioned Art Library filename. */
export function artLibraryThemedPath(
  pathWithTheme: string,
  theme: ArtLibraryTheme,
): string {
  if (pathWithTheme.includes("_light_")) {
    return pathWithTheme.replace("_light_", theme === "light" ? "_light_" : "_dark_");
  }
  if (pathWithTheme.includes("_dark_")) {
    return pathWithTheme.replace("_dark_", theme === "light" ? "_light_" : "_dark_");
  }
  return pathWithTheme;
}

export const WORLD_TREE_SEAM_OVERLAP_PERCENT = 9.375; // 96px seam @ 1024px tile height (manifest v2)

/**
 * World Tree modular segment bases.
 *
 * IMPORTANT: We no longer use legacy "foothills_*" identifiers in code.
 * During the transition, some new segment IDs intentionally alias existing
 * Art Library files until the full 5-part World Tree set is regenerated.
 *
 * Segment groups (World tree bible):
 * - roots (A–E)
 * - trunk (A–H)
 * - transitions (root_to_trunk, trunk_to_ancient, ancient_to_canopy, canopy_to_celestial)
 * - canopy (A–E)
 * - celestial (A–D)
 */
export const WORLD_TREE_TILE_BASES = {
  // Roots (N5)
  roots_a: "world-tree/segments/roots_a/wt_roots_a",
  roots_b: "world-tree/segments/roots_b/wt_roots_b",
  roots_c: "world-tree/segments/roots_c/wt_roots_c",
  roots_d: "world-tree/segments/roots_d/wt_roots_d",
  roots_e: "world-tree/segments/roots_e/wt_roots_e",

  // Trunk (N4/N3) — temporary aliases for existing POC tiles
  trunk_a: "world-tree/segments/trunk_a/wt_trunk_a",
  trunk_b: "world-tree/segments/trunk_b/wt_trunk_b",
  trunk_c: "world-tree/segments/trunk_c/wt_trunk_c",
  trunk_d: "world-tree/segments/trunk_d/wt_trunk_d",
  trunk_e: "world-tree/segments/trunk_e/wt_trunk_e",
  trunk_f: "world-tree/segments/trunk_f/wt_trunk_f",
  trunk_g: "world-tree/segments/trunk_g/wt_trunk_g",
  trunk_h: "world-tree/segments/trunk_h/wt_trunk_h",

  // Transition segments (biome connectors) — placeholder aliases until produced
  transition_root_to_trunk: "world-tree/03_foothills_02/wt_foothills_02",
  transition_trunk_to_ancient: "world-tree/04_foothills_03/wt_foothills_03",
  transition_ancient_to_canopy: "world-tree/transitions/ancient_to_canopy/wt_transition_ancient_to_canopy",
  transition_canopy_to_celestial: "world-tree/04_foothills_03/wt_foothills_03",

  // Canopy (N2) — placeholder aliases until produced
  canopy_a: "world-tree/04_foothills_03/wt_foothills_03",
  canopy_b: "world-tree/04_foothills_03/wt_foothills_03",
  canopy_c: "world-tree/04_foothills_03/wt_foothills_03",
  canopy_d: "world-tree/04_foothills_03/wt_foothills_03",
  canopy_e: "world-tree/04_foothills_03/wt_foothills_03",

  // Celestial (N1) — placeholder aliases until produced
  celestial_a: "world-tree/04_foothills_03/wt_foothills_03",
  celestial_b: "world-tree/04_foothills_03/wt_foothills_03",
  celestial_c: "world-tree/04_foothills_03/wt_foothills_03",
  celestial_d: "world-tree/04_foothills_03/wt_foothills_03",
} as const;

export type WorldTreeTileBase = (typeof WORLD_TREE_TILE_BASES)[keyof typeof WORLD_TREE_TILE_BASES];

/** Relative Art Library path for a world-tree tile file. */
export function worldTreeTileFile(
  basePath: WorldTreeTileBase | string,
  theme: ArtLibraryTheme,
  version = 2,
): string {
  const suffix = theme === "light" ? `_light_v${version}.png` : `_dark_v${version}.png`;
  const file = `${basePath.split("/").pop()}${suffix}`;
  const folder = basePath.replace(/\/[^/]+$/, "");
  return `${folder}/${file}`;
}

export const PROTOTYPE_BACKGROUNDS = {
  journey: {
    light: worldTreeTileFile(WORLD_TREE_TILE_BASES.roots_a, "light"),
    dark: worldTreeTileFile(WORLD_TREE_TILE_BASES.roots_a, "dark"),
  },
  camp: {
    light: "backgrounds/camp/bg_camp_light_v1.png",
    dark: "backgrounds/camp/bg_camp_dark_v1.png",
  },
  study: {
    light: "backgrounds/study/bg_study_light_v1.png",
    dark: "backgrounds/study/bg_study_dark_v1.png",
  },
  shrine: {
    light: "backgrounds/shrine/bg_shrine_light_v1.png",
    dark: "backgrounds/shrine/bg_shrine_dark_v1.png",
  },
  core: {
    light: "backgrounds/core/bg_core_light_v1.png",
    dark: "backgrounds/core/bg_core_dark_v1.png",
  },
} as const;

/** @deprecated Prefer worldTreeTileFile + ArtLibraryImage src for relative paths. */
export const PROTOTYPE_WORLD_TREE_TILES = [
  WORLD_TREE_TILE_BASES.trunk_c,
  WORLD_TREE_TILE_BASES.trunk_b,
  WORLD_TREE_TILE_BASES.trunk_a,
  WORLD_TREE_TILE_BASES.roots_a,
] as const;

/**
 * Full produced stack for journey canvas — crown-first render order (top → bottom).
 * Bottom tile `roots_a` is where the ascent begins.
 */
export const JOURNEY_WORLD_TREE_TILE_STACK: WorldTreeTileBase[] = [
  WORLD_TREE_TILE_BASES.transition_ancient_to_canopy,
  WORLD_TREE_TILE_BASES.trunk_h,
  WORLD_TREE_TILE_BASES.trunk_g,
  WORLD_TREE_TILE_BASES.trunk_f,
  WORLD_TREE_TILE_BASES.trunk_e,
  WORLD_TREE_TILE_BASES.trunk_d,
  WORLD_TREE_TILE_BASES.trunk_c,
  WORLD_TREE_TILE_BASES.trunk_b,
  WORLD_TREE_TILE_BASES.trunk_a,
  WORLD_TREE_TILE_BASES.roots_e,
  WORLD_TREE_TILE_BASES.roots_d,
  WORLD_TREE_TILE_BASES.roots_c,
  WORLD_TREE_TILE_BASES.roots_b,
  WORLD_TREE_TILE_BASES.roots_a,
];

export function worldTreeTilePath(
  basePath: WorldTreeTileBase | string,
  theme: ArtLibraryTheme,
  version = 2,
): string {
  return artLibraryPath(worldTreeTileFile(basePath, theme, version));
}
