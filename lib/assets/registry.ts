/**
 * Canonical public asset paths.
 * Source of truth: assets/ with metadata.json per asset-pipeline.md
 */
import {
  TRAIL_SCROLL_REGION_SLUGS,
  type TrailScrollRegionSlug,
  hasTrailScrollArt as regionHasTrailScrollArt,
} from "@/lib/design-system/regions";

export { TRAIL_SCROLL_REGION_SLUGS, type TrailScrollRegionSlug } from "@/lib/design-system/regions";

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
    yamaVictoriousDark: "/mascots/yama_victorious_dark_v1.webp",
    yamaVictoriousLight: "/mascots/yama_victorious_light_v1.webp",
    yamaConfusedDark: "/mascots/yama_confused_dark_v1.webp",
    yamaConfusedLight: "/mascots/yama_confused_light_v1.webp",
    yamaTeachingDark: "/mascots/yama_teaching_pointing_board_dark_v1.webp",
    yamaTeachingLight: "/mascots/yama_teaching_pointing_board_light_v1.webp",
    yamaSurprisedDark: "/mascots/yama_surprised_wide_eyes_dark_v1.webp",
    yamaSurprisedLight: "/mascots/yama_surprised_wide_eyes_light_v1.webp",
    yamaConcernedDark: "/mascots/yama_concerned_supportive_concern_dark_v1.webp",
    yamaConcernedLight: "/mascots/yama_concerned_supportive_concern_light_v1.webp",
    yamaDeterminedDark: "/mascots/yama_determined_ready_stance_dark_v1.webp",
    yamaDeterminedLight: "/mascots/yama_determined_ready_stance_light_v1.webp",
    yamaSleepingDark: "/mascots/yama_sleeping_resting_dark_v1.webp",
    yamaSleepingLight: "/mascots/yama_sleeping_resting_light_v1.webp",
    yamaSadDark: "/mascots/yama_sad_supportive_disappointed_dark_v1.webp",
    yamaSadLight: "/mascots/yama_sad_supportive_disappointed_light_v1.webp",
    yamaAdventureDark: "/mascots/yama_adventure_hiking_dark_v1.webp",
    yamaAdventureLight: "/mascots/yama_adventure_hiking_light_v1.webp",
    yamaTrainingDark: "/mascots/yama_training_demo_stance_dark_v1.webp",
    yamaTrainingLight: "/mascots/yama_training_demo_stance_light_v1.webp",
    yamaSeasonalDark: "/mascots/yama_seasonal_cherry_blossom_dark_v1.webp",
    yamaSeasonalLight: "/mascots/yama_seasonal_cherry_blossom_light_v1.webp",
    yamaRewardDark: "/mascots/yama_reward_presenting_badge_dark_v1.webp",
    yamaRewardLight: "/mascots/yama_reward_presenting_badge_light_v1.webp",
  },
  icons: {
    appLight: "/icons/icon_app_light_v1.webp",
    appDark: "/icons/icon_app_dark_v1.webp",
    navCamp: "/icons/icon_nav_camp_v1.webp",
    navJourney: "/icons/icon_nav_journey_v1.webp",
    navDojo: "/icons/icon_nav_dojo_v1.webp",
    navWorld: "/icons/icon_nav_world_v1.webp",
    navProfile: "/icons/icon_nav_profile_v1.webp",
    navHome: "/icons/icon_nav_home_v1.webp",
    navLearn: "/icons/icon_nav_learn_v1.webp",
    navReview: "/icons/icon_nav_review_v1.webp",
    navExplore: "/icons/icon_nav_explore_v1.webp",
    navFoxCampDark: "/mascots/yama_nav_camp_dark_v1.webp",
    navFoxCampLight: "/mascots/yama_nav_camp_light_v1.webp",
    navFoxJourneyDark: "/mascots/yama_nav_journey_dark_v1.webp",
    navFoxJourneyLight: "/mascots/yama_nav_journey_light_v1.webp",
    navFoxDojoDark: "/mascots/yama_nav_dojo_dark_v1.webp",
    navFoxDojoLight: "/mascots/yama_nav_dojo_light_v1.webp",
    navFoxWorldDark: "/mascots/yama_nav_world_dark_v1.webp",
    navFoxWorldLight: "/mascots/yama_nav_world_light_v1.webp",
    navFoxProfileDark: "/mascots/yama_nav_profile_dark_v1.webp",
    navFoxProfileLight: "/mascots/yama_nav_profile_light_v1.webp",
  },
  games: {
    wordMatch: "/games/game_word_match_v1.webp",
    vocabularyRush: "/games/game_vocabulary_rush_v1.webp",
    kanjiHunter: "/games/game_kanji_hunter_v1.webp",
    memoryDungeon: "/games/game_memory_dungeon_v1.webp",
    readingChallenge: "/games/game_reading_challenge_v1.webp",
  },
  brand: {
    wordmarkDark: "/brand/brand_wordmark_dark_v1.webp",
    wordmarkLight: "/brand/brand_wordmark_light_v1.webp",
  },
  ui: {
    trailSpineDark: "/ui/ui_trail_spine_dark_v1.webp",
    trailSpineLight: "/ui/ui_trail_spine_light_v1.webp",
    trailScrollFoothillsDark: "/ui/ui_trail_scroll_foothills_dark_v3.webp",
    trailScrollFoothillsLight: "/ui/ui_trail_scroll_foothills_light_v3.webp",
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
    memoryMaster: "/achievements/achievement_memory_master_v1.webp",
    gameChampion: "/achievements/achievement_game_champion_v1.webp",
    perfectRecall: "/achievements/achievement_perfect_recall_v1.webp",
    dungeonDelver: "/achievements/achievement_dungeon_delver_v1.webp",
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
  "memory-master": ASSET_REGISTRY.achievements.memoryMaster,
  "game-champion": ASSET_REGISTRY.achievements.gameChampion,
  "perfect-recall": ASSET_REGISTRY.achievements.perfectRecall,
  "dungeon-delver": ASSET_REGISTRY.achievements.dungeonDelver,
};

const GAME_SLUG_TO_ASSET: Record<string, string> = {
  "word-match": ASSET_REGISTRY.games.wordMatch,
  "vocabulary-rush": ASSET_REGISTRY.games.vocabularyRush,
  "kanji-hunter": ASSET_REGISTRY.games.kanjiHunter,
  "memory-dungeon": ASSET_REGISTRY.games.memoryDungeon,
  "reading-challenge": ASSET_REGISTRY.games.readingChallenge,
};

const NAV_TAB_TO_ASSET: Record<string, string> = {
  camp: ASSET_REGISTRY.icons.navCamp,
  journey: ASSET_REGISTRY.icons.navJourney,
  dojo: ASSET_REGISTRY.icons.navDojo,
  world: ASSET_REGISTRY.icons.navWorld,
  profile: ASSET_REGISTRY.icons.navProfile,
  home: ASSET_REGISTRY.icons.navHome,
  learn: ASSET_REGISTRY.icons.navLearn,
  review: ASSET_REGISTRY.icons.navReview,
  explore: ASSET_REGISTRY.icons.navExplore,
};

const NAV_FOX_TAB_TO_ASSET: Record<string, string> = {
  campDark: ASSET_REGISTRY.icons.navFoxCampDark,
  campLight: ASSET_REGISTRY.icons.navFoxCampLight,
  journeyDark: ASSET_REGISTRY.icons.navFoxJourneyDark,
  journeyLight: ASSET_REGISTRY.icons.navFoxJourneyLight,
  dojoDark: ASSET_REGISTRY.icons.navFoxDojoDark,
  dojoLight: ASSET_REGISTRY.icons.navFoxDojoLight,
  worldDark: ASSET_REGISTRY.icons.navFoxWorldDark,
  worldLight: ASSET_REGISTRY.icons.navFoxWorldLight,
  profileDark: ASSET_REGISTRY.icons.navFoxProfileDark,
  profileLight: ASSET_REGISTRY.icons.navFoxProfileLight,
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

const YAMA_EXPRESSION_DARK: Record<string, string> = {
  main: ASSET_REGISTRY.mascots.yamaMainDark,
  happy: ASSET_REGISTRY.mascots.yamaHappyDark,
  celebrating: ASSET_REGISTRY.mascots.yamaCelebratingDark,
  encouraging: ASSET_REGISTRY.mascots.yamaEncouragingDark,
  supportive: ASSET_REGISTRY.mascots.yamaEncouragingDark,
  thinking: ASSET_REGISTRY.mascots.yamaThinkingDark,
  studying: ASSET_REGISTRY.mascots.yamaThinkingDark,
  teaching: ASSET_REGISTRY.mascots.yamaTeachingDark,
  surprised: ASSET_REGISTRY.mascots.yamaSurprisedDark,
  concerned: ASSET_REGISTRY.mascots.yamaConcernedDark,
  determined: ASSET_REGISTRY.mascots.yamaDeterminedDark,
  sleeping: ASSET_REGISTRY.mascots.yamaSleepingDark,
  confused: ASSET_REGISTRY.mascots.yamaConfusedDark,
  sad: ASSET_REGISTRY.mascots.yamaSadDark,
  adventure: ASSET_REGISTRY.mascots.yamaAdventureDark,
  training: ASSET_REGISTRY.mascots.yamaTrainingDark,
  seasonal: ASSET_REGISTRY.mascots.yamaSeasonalDark,
  reward: ASSET_REGISTRY.mascots.yamaRewardDark,
  loading: ASSET_REGISTRY.mascots.yamaLoadingDark,
  victorious: ASSET_REGISTRY.mascots.yamaVictoriousDark,
};

const YAMA_EXPRESSION_LIGHT: Record<string, string> = {
  main: ASSET_REGISTRY.mascots.yamaMainLight,
  happy: ASSET_REGISTRY.mascots.yamaHappyLight,
  celebrating: ASSET_REGISTRY.mascots.yamaCelebratingLight,
  encouraging: ASSET_REGISTRY.mascots.yamaEncouragingLight,
  supportive: ASSET_REGISTRY.mascots.yamaEncouragingLight,
  thinking: ASSET_REGISTRY.mascots.yamaThinkingLight,
  studying: ASSET_REGISTRY.mascots.yamaThinkingLight,
  teaching: ASSET_REGISTRY.mascots.yamaTeachingLight,
  surprised: ASSET_REGISTRY.mascots.yamaSurprisedLight,
  concerned: ASSET_REGISTRY.mascots.yamaConcernedLight,
  determined: ASSET_REGISTRY.mascots.yamaDeterminedLight,
  sleeping: ASSET_REGISTRY.mascots.yamaSleepingLight,
  confused: ASSET_REGISTRY.mascots.yamaConfusedLight,
  sad: ASSET_REGISTRY.mascots.yamaSadLight,
  adventure: ASSET_REGISTRY.mascots.yamaAdventureLight,
  training: ASSET_REGISTRY.mascots.yamaTrainingLight,
  seasonal: ASSET_REGISTRY.mascots.yamaSeasonalLight,
  reward: ASSET_REGISTRY.mascots.yamaRewardLight,
  loading: ASSET_REGISTRY.mascots.yamaLoadingLight,
  victorious: ASSET_REGISTRY.mascots.yamaVictoriousLight,
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

export function getGameArtPath(slug: string) {
  return GAME_SLUG_TO_ASSET[slug] ?? null;
}

export function getNavIconPath(tab: string) {
  return NAV_TAB_TO_ASSET[tab] ?? null;
}

export function getNavFoxPath(tab: string, theme: "light" | "dark" | string | undefined) {
  const mode = theme === "light" ? "Light" : "Dark";
  const key = `${tab}${mode}`;
  return NAV_FOX_TAB_TO_ASSET[key] ?? null;
}

export function getNavTabMascotExpression(tab: string) {
  const expressions: Record<string, string> = {
    camp: "encouraging",
    journey: "adventure",
    dojo: "training",
    world: "adventure",
    profile: "victorious",
  };
  return expressions[tab] ?? "main";
}

export function getRegionArtPath(slug: string) {
  return REGION_SLUG_TO_ASSET[slug] ?? null;
}

/** Spine art calibrated to TRAIL_MAP_PATH_ANCHORS — use for all trail map UIs. */
export function getTrailSpineArtPath(
  theme: "light" | "dark" | string | undefined,
) {
  return theme === "light"
    ? ASSET_REGISTRY.ui.trailSpineLight
    : ASSET_REGISTRY.ui.trailSpineDark;
}

/** Per-region scroll art version (path-first v3 from journey-path-contracts). */
const TRAIL_SCROLL_VERSION_BY_REGION: Partial<Record<TrailScrollRegionSlug, string>> = {
  foothills: "v3",
  "forest-trail": "v3",
  "mount-n5": "v3",
  "mount-n4": "v3",
  "mount-n3": "v3",
  "mount-n2": "v3",
  "mount-n1": "v3",
  "master-summit": "v3",
};

function buildTrailScrollPublicPath(
  regionSlug: TrailScrollRegionSlug,
  theme: "light" | "dark",
  trailSegmentIndex = 0,
): string {
  const version = TRAIL_SCROLL_VERSION_BY_REGION[regionSlug] ?? "v1";
  if (trailSegmentIndex === 0) {
    return `/ui/ui_trail_scroll_${regionSlug}_${theme}_${version}.webp`;
  }
  return `/ui/ui_trail_scroll_${regionSlug}_trail-${trailSegmentIndex + 1}_${theme}_v1.webp`;
}

const TRAIL_SCROLL_PATH_BY_REGION = Object.fromEntries(
  TRAIL_SCROLL_REGION_SLUGS.map((slug) => [
    slug,
    {
      dark: buildTrailScrollPublicPath(slug, "dark"),
      light: buildTrailScrollPublicPath(slug, "light"),
    },
  ]),
) as Record<TrailScrollRegionSlug, Record<"light" | "dark", string>>;

/** Immersive vertical scroll art for a region + theme. Returns null when no dedicated scroll exists. */
export function getTrailScrollArtPath(
  regionSlug: string | undefined,
  theme: "light" | "dark" | string | undefined,
  trailSegmentIndex = 0,
): string | null {
  if (!regionHasTrailScrollArt(regionSlug)) {
    return null;
  }

  const mode = theme === "light" ? "light" : "dark";
  if (trailSegmentIndex === 0) {
    const paths = TRAIL_SCROLL_PATH_BY_REGION[regionSlug as TrailScrollRegionSlug];
    return paths?.[mode] ?? null;
  }

  return buildTrailScrollPublicPath(
    regionSlug as TrailScrollRegionSlug,
    mode,
    trailSegmentIndex,
  );
}

export function hasTrailScrollArt(regionSlug: string | undefined): boolean {
  return regionHasTrailScrollArt(regionSlug);
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
