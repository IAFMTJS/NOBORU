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

export const PROTOTYPE_BACKGROUNDS = {
  journey: {
    light: "backgrounds/camp/bg_camp_light_v1.png",
    dark: "backgrounds/camp/bg_camp_dark_v1.png",
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
