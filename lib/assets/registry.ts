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
    yamaTrailCompanionDark: "/mascots/yama_trail_companion_dark_v1.webp",
    yamaTrailCompanionLight: "/mascots/yama_trail_companion_light_v1.webp",
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
    navCamp: "/icons/icon_nav_camp_v2.webp",
    navJourney: "/icons/icon_nav_journey_v2.webp",
    navDojo: "/icons/icon_nav_dojo_v2.webp",
    navWorld: "/icons/icon_nav_world_v2.webp",
    navProfile: "/icons/icon_nav_profile_v2.webp",
    navFoxCampDark: "/mascots/yama_nav_camp_dark_v2.webp",
    navFoxCampLight: "/mascots/yama_nav_camp_light_v2.webp",
    navFoxJourneyDark: "/mascots/yama_nav_journey_dark_v2.webp",
    navFoxJourneyLight: "/mascots/yama_nav_journey_light_v2.webp",
    navFoxDojoDark: "/mascots/yama_nav_dojo_dark_v2.webp",
    navFoxDojoLight: "/mascots/yama_nav_dojo_light_v2.webp",
    navFoxWorldDark: "/mascots/yama_nav_world_dark_v2.webp",
    navFoxWorldLight: "/mascots/yama_nav_world_light_v2.webp",
    navFoxProfileDark: "/mascots/yama_nav_profile_dark_v2.webp",
    navFoxProfileLight: "/mascots/yama_nav_profile_light_v2.webp",
    uiChevronDown: "/icons/icon_ui_chevron_down_v2.webp",
    uiMap: "/icons/icon_ui_map_v2.webp",
    uiSettings: "/icons/icon_ui_settings_v2.webp",
    uiFlame: "/icons/icon_ui_flame_v2.webp",
    uiGem: "/icons/icon_ui_gem_v2.webp",
    uiTrophy: "/icons/icon_ui_trophy_v2.webp",
    uiGear: "/icons/icon_ui_gear_v2.webp",
    uiCheckpoint: "/icons/icon_ui_checkpoint_v2.webp",
    uiCheck: "/icons/icon_ui_check_v2.webp",
    uiLock: "/icons/icon_ui_lock_v2.webp",
    uiArrowLeft: "/icons/icon_ui_arrow_left_v2.webp",
    uiClock: "/icons/icon_ui_clock_v2.webp",
    uiZap: "/icons/icon_ui_zap_v2.webp",
    uiCoins: "/icons/icon_ui_coins_v2.webp",
    uiMountain: "/icons/icon_ui_mountain_v2.webp",
    dojoKana: "/icons/icon_dojo_kana_v2.webp",
    dojoVocab: "/icons/icon_dojo_vocab_v2.webp",
    dojoGrammar: "/icons/icon_dojo_grammar_v2.webp",
    dojoListening: "/icons/icon_dojo_listening_v2.webp",
    dojoReview: "/icons/icon_dojo_review_v2.webp",
    dojoKanji: "/icons/icon_dojo_kanji_v2.webp",
    dojoReading: "/icons/icon_dojo_reading_v2.webp",
    worldTrials: "/icons/icon_world_trials_v2.webp",
    worldGames: "/icons/icon_world_games_v2.webp",
    worldSocial: "/icons/icon_world_social_v2.webp",
    worldShop: "/icons/icon_world_shop_v2.webp",
    worldInventory: "/icons/icon_world_inventory_v2.webp",
    worldEvents: "/icons/icon_world_events_v2.webp",
    worldMap: "/icons/icon_world_map_v2.webp",
    hubVocabulary: "/icons/icon_ui_hub_vocabulary_v2.webp",
    hubKanji: "/icons/icon_ui_hub_kanji_v2.webp",
    hubGrammar: "/icons/icon_ui_hub_grammar_v2.webp",
    hubReading: "/icons/icon_ui_hub_reading_v2.webp",
    hubListening: "/icons/icon_ui_hub_listening_v2.webp",
    hubHiragana: "/icons/icon_ui_hub_hiragana_v2.webp",
    hubKatakana: "/icons/icon_ui_hub_katakana_v2.webp",
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
    campBaseDark: "/ui/ui_camp_base_night_v1.webp",
    campBaseLight: "/ui/ui_camp_base_light_v1.webp",
    dojoForestDark: "/ui/ui_dojo_forest_night_v1.webp",
    shrineToriiNight: "/ui/ui_shrine_torii_night_v1.webp",
    worldMapPeaks: "/ui/ui_world_map_peaks_v1.webp",
    shopInterior: "/ui/ui_shop_trail_interior_v1.webp",
    lessonCompleteGlow: "/ui/ui_lesson_complete_trail_glow_v1.webp",
    checkpointShrine: "/ui/ui_checkpoint_shrine_close_v1.webp",
    navSkinEmberNight: "/ui/ui_nav_skin_ember_night_v1.webp",
    navSkinTrailMist: "/ui/ui_nav_skin_trail_mist_v1.webp",
    navSkinBambooGrove: "/ui/ui_nav_skin_bamboo_grove_v1.webp",
    navSkinMoonlitTorii: "/ui/ui_nav_skin_moonlit_torii_v1.webp",
    navSkinStonePath: "/ui/ui_nav_skin_stone_path_v1.webp",
    navSkinSakuraBloom: "/ui/ui_nav_skin_sakura_bloom_v1.webp",
    navSkinWinterSummit: "/ui/ui_nav_skin_winter_summit_v1.webp",
    navSkinLanternFestival: "/ui/ui_nav_skin_lantern_festival_v1.webp",
    navSkinCherryDawn: "/ui/ui_nav_skin_cherry_dawn_v1.webp",
    navSkinCloudSea: "/ui/ui_nav_skin_cloud_sea_v1.webp",
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

const UI_ICON_PATHS: Record<string, string> = {
  chevron_down: ASSET_REGISTRY.icons.uiChevronDown,
  map: ASSET_REGISTRY.icons.uiMap,
  settings: ASSET_REGISTRY.icons.uiSettings,
  flame: ASSET_REGISTRY.icons.uiFlame,
  gem: ASSET_REGISTRY.icons.uiGem,
  trophy: ASSET_REGISTRY.icons.uiTrophy,
  gear: ASSET_REGISTRY.icons.uiGear,
  checkpoint: ASSET_REGISTRY.icons.uiCheckpoint,
  check: ASSET_REGISTRY.icons.uiCheck,
  lock: ASSET_REGISTRY.icons.uiLock,
  arrow_left: ASSET_REGISTRY.icons.uiArrowLeft,
  clock: ASSET_REGISTRY.icons.uiClock,
  zap: ASSET_REGISTRY.icons.uiZap,
  coins: ASSET_REGISTRY.icons.uiCoins,
  mountain: ASSET_REGISTRY.icons.uiMountain,
};

export function getUiIconPath(name: string) {
  return UI_ICON_PATHS[name] ?? null;
}

const DOJO_ICON_PATHS: Record<string, string> = {
  kana: ASSET_REGISTRY.icons.dojoKana,
  vocab: ASSET_REGISTRY.icons.dojoVocab,
  grammar: ASSET_REGISTRY.icons.dojoGrammar,
  listening: ASSET_REGISTRY.icons.dojoListening,
  review: ASSET_REGISTRY.icons.dojoReview,
  kanji: ASSET_REGISTRY.icons.dojoKanji,
  reading: ASSET_REGISTRY.icons.dojoReading,
  review_queue: ASSET_REGISTRY.icons.dojoReview,
  kana_dojo: ASSET_REGISTRY.icons.dojoKana,
  vocabulary_hall: ASSET_REGISTRY.icons.dojoVocab,
  grammar_shrine: ASSET_REGISTRY.icons.dojoGrammar,
  listening_pavilion: ASSET_REGISTRY.icons.dojoListening,
  kanji_grounds: ASSET_REGISTRY.icons.dojoKanji,
  reading_library: ASSET_REGISTRY.icons.dojoReading,
};

const WORLD_ICON_PATHS: Record<string, string> = {
  trials: ASSET_REGISTRY.icons.worldTrials,
  games: ASSET_REGISTRY.icons.worldGames,
  social: ASSET_REGISTRY.icons.worldSocial,
  shop: ASSET_REGISTRY.icons.worldShop,
  inventory: ASSET_REGISTRY.icons.worldInventory,
  events: ASSET_REGISTRY.icons.worldEvents,
  map: ASSET_REGISTRY.icons.worldMap,
  discover: ASSET_REGISTRY.icons.worldMap,
  world_map: ASSET_REGISTRY.icons.worldMap,
  community: ASSET_REGISTRY.icons.worldSocial,
  collect: ASSET_REGISTRY.icons.worldInventory,
  endgame: ASSET_REGISTRY.icons.worldTrials,
  trails: ASSET_REGISTRY.icons.worldMap,
};

const HUB_ART_PATHS: Record<string, string> = {
  vocabulary: ASSET_REGISTRY.icons.hubVocabulary,
  kanji: ASSET_REGISTRY.icons.hubKanji,
  grammar: ASSET_REGISTRY.icons.hubGrammar,
  reading: ASSET_REGISTRY.icons.hubReading,
  listening: ASSET_REGISTRY.icons.hubListening,
  hiragana: ASSET_REGISTRY.icons.hubHiragana,
  katakana: ASSET_REGISTRY.icons.hubKatakana,
};

export function getDojoIconPath(slug: string) {
  return DOJO_ICON_PATHS[slug] ?? null;
}

export function getWorldIconPath(slug: string) {
  return WORLD_ICON_PATHS[slug] ?? null;
}

export function getHubArtPath(slug: string) {
  return HUB_ART_PATHS[slug] ?? null;
}

export function getTrailCompanionPath(theme: "light" | "dark" | string | undefined) {
  return theme === "light"
    ? ASSET_REGISTRY.mascots.yamaTrailCompanionLight
    : ASSET_REGISTRY.mascots.yamaTrailCompanionDark;
}

/** Trail-map fox sticker — null when dedicated WebP is not yet in public/. */
export function getYamaTrailCompanionPath(
  theme: "light" | "dark" | string | undefined,
) {
  return getTrailCompanionPath(theme);
}

const SCENE_PATHS: Record<string, { dark: string; light: string }> = {
  camp_base: {
    dark: ASSET_REGISTRY.ui.campBaseDark,
    light: ASSET_REGISTRY.ui.campBaseLight,
  },
  dojo_forest: {
    dark: ASSET_REGISTRY.ui.dojoForestDark,
    light: ASSET_REGISTRY.ui.dojoForestDark,
  },
  shrine_torii: {
    dark: ASSET_REGISTRY.ui.shrineToriiNight,
    light: ASSET_REGISTRY.ui.shrineToriiNight,
  },
  world_map_peaks: {
    dark: ASSET_REGISTRY.ui.worldMapPeaks,
    light: ASSET_REGISTRY.ui.worldMapPeaks,
  },
  shop_interior: {
    dark: ASSET_REGISTRY.ui.shopInterior,
    light: ASSET_REGISTRY.ui.shopInterior,
  },
  lesson_complete: {
    dark: ASSET_REGISTRY.ui.lessonCompleteGlow,
    light: ASSET_REGISTRY.ui.lessonCompleteGlow,
  },
  checkpoint_shrine: {
    dark: ASSET_REGISTRY.ui.checkpointShrine,
    light: ASSET_REGISTRY.ui.checkpointShrine,
  },
};

export function getSceneArtPath(
  scene: string,
  theme: "light" | "dark" | string | undefined,
) {
  const paths = SCENE_PATHS[scene];
  if (!paths) return null;
  return theme === "light" ? paths.light : paths.dark;
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
