/** Build URLs for Art Library assets (API route reads public/art-library when published). */

export type ArtLibraryTheme = "light" | "dark";

/** e.g. artLibraryPath("icons/icon_nav_journey_mountain_light_v1.png") */
export function artLibraryPath(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const relative = normalized
    .replace(/^api\/art-library\//, "")
    .replace(/^art-library\//, "");
  return `/api/art-library/${relative.split("/").map(encodeURIComponent).join("/")}`;
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

export const PROTOTYPE_BACKGROUNDS = {
  journey: {
    light: "backgrounds/trail/bg_trail_light_v1.png",
    dark: "backgrounds/trail/bg_trail_dark_v1.png",
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

export const WORLD_TREE_SEAM_OVERLAP_PERCENT = 9.375; // 96px seam @ 1024px tile height (manifest v2)

export const WORLD_TREE_TILE_BASES = {
  roots: "world-tree/01_roots/wt_roots",
  foothills01: "world-tree/02_foothills_01/wt_foothills_01",
  foothills02: "world-tree/03_foothills_02/wt_foothills_02",
  foothills03: "world-tree/04_foothills_03/wt_foothills_03",
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

/** @deprecated Prefer worldTreeTileFile + ArtLibraryImage src for relative paths. */
export const PROTOTYPE_WORLD_TREE_TILES = [
  WORLD_TREE_TILE_BASES.foothills03,
  WORLD_TREE_TILE_BASES.foothills02,
  WORLD_TREE_TILE_BASES.foothills01,
  WORLD_TREE_TILE_BASES.roots,
] as const;

export function worldTreeTilePath(
  basePath: WorldTreeTileBase | string,
  theme: ArtLibraryTheme,
  version = 2,
): string {
  return artLibraryPath(worldTreeTileFile(basePath, theme, version));
}
