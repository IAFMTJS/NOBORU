/**
 * Canonical public asset paths.
 * Source of truth: assets/ with metadata.json per asset-pipeline.md
 */
export const ASSET_REGISTRY = {
  mascots: {
    yamaMainLight: "/mascots/yama_main_light_v1.webp",
    yamaMainDark: "/mascots/yama_main_dark_v1.webp",
    yamaHappyDark: "/mascots/yama_happy_dark_v2.webp",
    yamaHappyLight: "/mascots/yama_happy_light_v1.webp",
    yamaCelebratingDark: "/mascots/yama_celebrating_dark_v2.webp",
    yamaCelebratingLight: "/mascots/yama_celebrating_light_v1.webp",
    yamaEncouragingDark: "/mascots/yama_encouraging_dark_v2.webp",
    yamaEncouragingLight: "/mascots/yama_encouraging_light_v1.webp",
    yamaThinkingDark: "/mascots/yama_thinking_dark_v2.webp",
    yamaThinkingLight: "/mascots/yama_thinking_light_v1.webp",
    yamaLoadingDark: "/mascots/yama_loading_dark_v2.webp",
    yamaLoadingLight: "/mascots/yama_loading_light_v1.webp",
  },
  icons: {
    appLight: "/icons/icon_app_light_v1.webp",
    appDark: "/icons/icon_app_dark_v1.webp",
  },
  brand: {
    wordmarkDark: "/brand/brand_wordmark_dark_v1.webp",
    wordmarkLight: "/brand/brand_wordmark_light_v1.webp",
  },
  ui: {
    trailSpineDark: "/ui/ui_trail_spine_dark_v1.webp",
    trailSpineLight: "/ui/ui_trail_spine_light_v1.webp",
    trailScrollFoothillsDark: "/ui/ui_trail_scroll_foothills_dark_v1.webp",
    trailScrollFoothillsLight: "/ui/ui_trail_scroll_foothills_light_v1.webp",
    authAtmosphereDark: "/ui/ui_auth_atmosphere_dark_v1.webp",
    authAtmosphereLight: "/ui/ui_auth_atmosphere_light_v1.webp",
  },
  achievements: {
    firstStep: "/achievements/achievement_first_step_v1.webp",
    firstLesson: "/achievements/achievement_first_lesson_v1.webp",
    trailWalker: "/achievements/achievement_trail_walker_v1.webp",
    wordCollector: "/achievements/achievement_word_collector_v1.webp",
    kanjiScholar: "/achievements/achievement_kanji_scholar_v1.webp",
    steadyClimber: "/achievements/achievement_steady_climber_v1.webp",
    n5Summit: "/achievements/achievement_n5_summit_v1.webp",
  },
  regions: {
    foothills: "/regions/region_foothills_v1.webp",
    forestTrail: "/regions/region_forest_trail_v1.webp",
    mountN5: "/regions/region_mount_n5_v1.webp",
    mountN4: "/regions/region_mount_n4_v1.webp",
    mountN3: "/regions/region_mount_n3_v1.webp",
    mountN2: "/regions/region_mount_n2_v1.webp",
    mountN1: "/regions/region_mount_n1_v1.webp",
    masterSummit: "/regions/region_master_summit_v1.webp",
  },
} as const;

const ACHIEVEMENT_SLUG_TO_ASSET: Record<string, string> = {
  "first-step": ASSET_REGISTRY.achievements.firstStep,
  "first-lesson": ASSET_REGISTRY.achievements.firstLesson,
  "ten-lessons": ASSET_REGISTRY.achievements.trailWalker,
  "hundred-words": ASSET_REGISTRY.achievements.wordCollector,
  "fifty-kanji": ASSET_REGISTRY.achievements.kanjiScholar,
  "seven-day-streak": ASSET_REGISTRY.achievements.steadyClimber,
  "n5-completed": ASSET_REGISTRY.achievements.n5Summit,
};

const REGION_SLUG_TO_ASSET: Record<string, string> = {
  foothills: ASSET_REGISTRY.regions.foothills,
  "forest-trail": ASSET_REGISTRY.regions.forestTrail,
  "mount-n5": ASSET_REGISTRY.regions.mountN5,
  "mount-n4": ASSET_REGISTRY.regions.mountN4,
  "mount-n3": ASSET_REGISTRY.regions.mountN3,
  "mount-n2": ASSET_REGISTRY.regions.mountN2,
  "mount-n1": ASSET_REGISTRY.regions.mountN1,
  "master-summit": ASSET_REGISTRY.regions.masterSummit,
};

/**
 * Region slugs with dedicated vertical trail scroll art.
 * Public path pattern: `/ui/ui_trail_scroll_{slug}_{theme}_v1.webp`
 * Add a slug here when a region receives its own scroll asset pair (dark + light).
 */
export const TRAIL_SCROLL_REGION_SLUGS = ["foothills"] as const;

export type TrailScrollRegionSlug = (typeof TRAIL_SCROLL_REGION_SLUGS)[number];

const TRAIL_SCROLL_REGION_SLUG_SET = new Set<string>(TRAIL_SCROLL_REGION_SLUGS);

const TRAIL_SCROLL_FALLBACK: Record<"light" | "dark", string> = {
  dark: ASSET_REGISTRY.ui.trailScrollFoothillsDark,
  light: ASSET_REGISTRY.ui.trailScrollFoothillsLight,
};

const YAMA_EXPRESSION_DARK: Record<string, string> = {
  main: ASSET_REGISTRY.mascots.yamaMainDark,
  happy: ASSET_REGISTRY.mascots.yamaHappyDark,
  celebrating: ASSET_REGISTRY.mascots.yamaCelebratingDark,
  encouraging: ASSET_REGISTRY.mascots.yamaEncouragingDark,
  supportive: ASSET_REGISTRY.mascots.yamaEncouragingDark,
  thinking: ASSET_REGISTRY.mascots.yamaThinkingDark,
  studying: ASSET_REGISTRY.mascots.yamaThinkingDark,
  loading: ASSET_REGISTRY.mascots.yamaLoadingDark,
};

const YAMA_EXPRESSION_LIGHT: Record<string, string> = {
  main: ASSET_REGISTRY.mascots.yamaMainLight,
  happy: ASSET_REGISTRY.mascots.yamaHappyLight,
  celebrating: ASSET_REGISTRY.mascots.yamaCelebratingLight,
  encouraging: ASSET_REGISTRY.mascots.yamaEncouragingLight,
  supportive: ASSET_REGISTRY.mascots.yamaEncouragingLight,
  thinking: ASSET_REGISTRY.mascots.yamaThinkingLight,
  studying: ASSET_REGISTRY.mascots.yamaThinkingLight,
  loading: ASSET_REGISTRY.mascots.yamaLoadingLight,
};

export function getMascotPath(theme: "light" | "dark" | string | undefined) {
  return theme === "light"
    ? ASSET_REGISTRY.mascots.yamaMainLight
    : ASSET_REGISTRY.mascots.yamaMainDark;
}

export function getYamaExpressionPath(
  expression: string,
  theme: "light" | "dark" | string | undefined,
) {
  const map = theme === "light" ? YAMA_EXPRESSION_LIGHT : YAMA_EXPRESSION_DARK;
  return map[expression] ?? getMascotPath(theme);
}

export function getAchievementArtPath(slug: string) {
  return ACHIEVEMENT_SLUG_TO_ASSET[slug] ?? null;
}

export function getRegionArtPath(slug: string) {
  return REGION_SLUG_TO_ASSET[slug] ?? null;
}

export function getTrailMapArtPath(theme: "light" | "dark" | string | undefined) {
  return theme === "light"
    ? ASSET_REGISTRY.ui.trailSpineLight
    : ASSET_REGISTRY.ui.trailSpineDark;
}

const TRAIL_SCROLL_PATH_BY_REGION: Record<
  TrailScrollRegionSlug,
  Record<"light" | "dark", string>
> = {
  foothills: {
    dark: ASSET_REGISTRY.ui.trailScrollFoothillsDark,
    light: ASSET_REGISTRY.ui.trailScrollFoothillsLight,
  },
};

/** Immersive vertical scroll art for a region + theme. Falls back to Foothills when slug is unknown. */
export function getTrailScrollArtPath(
  regionSlug: string | undefined,
  theme: "light" | "dark" | string | undefined,
): string | null {
  const mode = theme === "light" ? "light" : "dark";
  const slug = regionSlug ?? "foothills";
  const paths = TRAIL_SCROLL_PATH_BY_REGION[slug as TrailScrollRegionSlug];

  if (paths) {
    return paths[mode];
  }

  return TRAIL_SCROLL_FALLBACK[mode];
}

export function hasTrailScrollArt(regionSlug: string | undefined): boolean {
  return TRAIL_SCROLL_REGION_SLUG_SET.has(regionSlug ?? "foothills");
}

/** @deprecated Use getTrailMapArtPath */
export function getTrailSpinePath(theme: "light" | "dark" | string | undefined) {
  return getTrailMapArtPath(theme);
}

export function getWordmarkPath(theme: "light" | "dark" | string | undefined) {
  return theme === "light"
    ? ASSET_REGISTRY.brand.wordmarkLight
    : ASSET_REGISTRY.brand.wordmarkDark;
}

export function getAuthAtmospherePath(theme: "light" | "dark" | string | undefined) {
  return theme === "light"
    ? ASSET_REGISTRY.ui.authAtmosphereLight
    : ASSET_REGISTRY.ui.authAtmosphereDark;
}
