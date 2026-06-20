/**
 * Maps app concepts to art-direction asset IDs (06_asset_inventory_and_naming.md).
 */
import type { SceneId } from "@/components/media/scene-image";
import { ACHIEVEMENT_SLUGS } from "@/features/achievements/constants/achievement.constants";
import { GAME_SLUGS } from "@/features/games/constants/game.constants";
import type { YamaExpression } from "@/features/yama/types/yama.types";
import type { ArtCategory } from "@/lib/assets/art-paths";
import type { RegionSlug } from "@/lib/design-system/regions";
import type { NavPillSkinId } from "@/lib/navigation/nav-skin.resolver";
import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";

export type ArtAssetRef = {
  category: ArtCategory;
  id: string;
};

export const SCENE_BACKGROUND_ASSETS: Record<SceneId, ArtAssetRef> = {
  camp_base: { category: "backgrounds/camp", id: "bg-camp-home-night" },
  dojo_forest: { category: "backgrounds/study", id: "bg-study-bamboo" },
  shrine_torii: { category: "backgrounds/shrine", id: "bg-shrine-achievements" },
  world_map_peaks: { category: "backgrounds/camp", id: "bg-camp-home-night" },
  shop_interior: { category: "backgrounds/utility", id: "bg-shop-general-store-dark" },
  lesson_complete: { category: "backgrounds/shrine", id: "bg-shrine-lesson-complete-path" },
  checkpoint_shrine: { category: "backgrounds/shrine", id: "bg-shrine-checkpoint" },
  memory_book_journal: { category: "backgrounds/utility", id: "bg-memory-book-frame" },
  seasonal_sakura: { category: "backgrounds/study", id: "bg-study-sakura" },
  social_gathering: { category: "backgrounds/utility", id: "bg-social-leaderboard-dark" },
  inventory_backpack: { category: "backgrounds/camp", id: "bg-camp-daily-quests" },
  review_atmosphere: { category: "backgrounds/camp", id: "bg-camp-offline" },
  study_atmosphere: { category: "backgrounds/study", id: "bg-study-default" },
  profile_lantern_path: { category: "backgrounds/utility", id: "bg-settings-dark-panel" },
};

/** Region thumbnails in the trail atlas — world-tree art TBD. */
export const REGION_THUMBNAIL_ASSETS: Record<RegionSlug, ArtAssetRef> = {
  foothills: { category: "backgrounds/camp", id: "bg-camp-home-night" },
  "mount-n5": { category: "backgrounds/camp", id: "bg-camp-lantern" },
  "forest-trail": { category: "backgrounds/study", id: "bg-study-bamboo" },
  "mount-n4": { category: "backgrounds/study", id: "bg-study-default" },
  "mount-n3": { category: "backgrounds/shrine", id: "bg-shrine-checkpoint" },
  "mount-n2": { category: "backgrounds/shrine", id: "bg-shrine-achievements" },
  "mount-n1": { category: "backgrounds/shrine", id: "bg-shrine-lesson-complete-path" },
  "master-summit": { category: "backgrounds/shrine", id: "bg-shrine-region-transition-torii" },
};

export const YAMA_EXPRESSION_ASSETS: Record<YamaExpression, ArtAssetRef> = {
  main: { category: "characters/noboru/base", id: "char-noboru-standing-traveler" },
  happy: { category: "characters/noboru/reactions", id: "char-noboru-reaction-happy" },
  celebrating: { category: "characters/noboru/reactions", id: "char-noboru-reaction-proud" },
  encouraging: { category: "characters/noboru/reactions", id: "char-noboru-reaction-encouraging" },
  supportive: { category: "characters/noboru/reactions", id: "char-noboru-reaction-encouraging" },
  thinking: { category: "characters/noboru/base", id: "char-noboru-reading-book" },
  studying: { category: "characters/noboru/base", id: "char-noboru-reading-book" },
  teaching: { category: "characters/noboru/reactions", id: "char-noboru-reaction-teaching" },
  surprised: { category: "characters/noboru/reactions", id: "char-noboru-reaction-excited" },
  concerned: { category: "characters/noboru/reactions", id: "char-noboru-reaction-worried" },
  determined: { category: "characters/noboru/base", id: "char-noboru-running-ember" },
  sleeping: { category: "characters/noboru/base", id: "char-noboru-sitting-campfire" },
  confused: { category: "characters/noboru/reactions", id: "char-noboru-reaction-oops" },
  sad: { category: "characters/noboru/reactions", id: "char-noboru-reaction-out-of-hearts" },
  adventure: { category: "characters/noboru/base", id: "char-noboru-walking-backpack" },
  training: { category: "characters/noboru/base", id: "char-noboru-meditating-dojo" },
  seasonal: { category: "characters/noboru/weather", id: "char-noboru-weather-sunny" },
  reward: { category: "characters/noboru/reactions", id: "char-noboru-reaction-mastery" },
  loading: { category: "characters/noboru/base", id: "char-noboru-standing-traveler" },
  victorious: { category: "characters/noboru/reactions", id: "char-noboru-reaction-proud" },
};

/** All 28 Noboru companion poses under public/art/characters/noboru/. */
export const NOBORU_POSE_ASSETS = {
  "char-noboru-from-behind-region-transition": {
    category: "characters/noboru/base",
    id: "char-noboru-from-behind-region-transition",
  },
  "char-noboru-hero-profile": {
    category: "characters/noboru/base",
    id: "char-noboru-hero-profile",
  },
  "char-noboru-meditating-dojo": {
    category: "characters/noboru/base",
    id: "char-noboru-meditating-dojo",
  },
  "char-noboru-peeking-locked-detail": {
    category: "characters/noboru/base",
    id: "char-noboru-peeking-locked-detail",
  },
  "char-noboru-reading-book": {
    category: "characters/noboru/base",
    id: "char-noboru-reading-book",
  },
  "char-noboru-running-ember": {
    category: "characters/noboru/base",
    id: "char-noboru-running-ember",
  },
  "char-noboru-sitting-campfire": {
    category: "characters/noboru/base",
    id: "char-noboru-sitting-campfire",
  },
  "char-noboru-standing-traveler": {
    category: "characters/noboru/base",
    id: "char-noboru-standing-traveler",
  },
  "char-noboru-telescope-world": {
    category: "characters/noboru/base",
    id: "char-noboru-telescope-world",
  },
  "char-noboru-walking-backpack": {
    category: "characters/noboru/base",
    id: "char-noboru-walking-backpack",
  },
  "char-noboru-winter-staff": {
    category: "characters/noboru/base",
    id: "char-noboru-winter-staff",
  },
  "char-noboru-cosmetic-backpack-bamboo": {
    category: "characters/noboru/cosmetics",
    id: "char-noboru-cosmetic-backpack-bamboo",
  },
  "char-noboru-cosmetic-fox-mask": {
    category: "characters/noboru/cosmetics",
    id: "char-noboru-cosmetic-fox-mask",
  },
  "char-noboru-cosmetic-preview-base": {
    category: "characters/noboru/cosmetics",
    id: "char-noboru-cosmetic-preview-base",
  },
  "char-noboru-cosmetic-scarf-crimson": {
    category: "characters/noboru/cosmetics",
    id: "char-noboru-cosmetic-scarf-crimson",
  },
  "char-noboru-reaction-encouraging": {
    category: "characters/noboru/reactions",
    id: "char-noboru-reaction-encouraging",
  },
  "char-noboru-reaction-excited": {
    category: "characters/noboru/reactions",
    id: "char-noboru-reaction-excited",
  },
  "char-noboru-reaction-happy": {
    category: "characters/noboru/reactions",
    id: "char-noboru-reaction-happy",
  },
  "char-noboru-reaction-mastery": {
    category: "characters/noboru/reactions",
    id: "char-noboru-reaction-mastery",
  },
  "char-noboru-reaction-oops": {
    category: "characters/noboru/reactions",
    id: "char-noboru-reaction-oops",
  },
  "char-noboru-reaction-out-of-hearts": {
    category: "characters/noboru/reactions",
    id: "char-noboru-reaction-out-of-hearts",
  },
  "char-noboru-reaction-proud": {
    category: "characters/noboru/reactions",
    id: "char-noboru-reaction-proud",
  },
  "char-noboru-reaction-teaching": {
    category: "characters/noboru/reactions",
    id: "char-noboru-reaction-teaching",
  },
  "char-noboru-reaction-worried": {
    category: "characters/noboru/reactions",
    id: "char-noboru-reaction-worried",
  },
  "char-noboru-weather-night-lantern": {
    category: "characters/noboru/weather",
    id: "char-noboru-weather-night-lantern",
  },
  "char-noboru-weather-rainy-umbrella": {
    category: "characters/noboru/weather",
    id: "char-noboru-weather-rainy-umbrella",
  },
  "char-noboru-weather-snowy-cloak": {
    category: "characters/noboru/weather",
    id: "char-noboru-weather-snowy-cloak",
  },
  "char-noboru-weather-sunny": {
    category: "characters/noboru/weather",
    id: "char-noboru-weather-sunny",
  },
} as const satisfies Record<string, ArtAssetRef>;

export type NoboruPoseId = keyof typeof NOBORU_POSE_ASSETS;

export const NAV_TAB_ICON_ASSETS: Record<ImmersiveNavTab, ArtAssetRef> = {
  journey: { category: "ui/icons/nav", id: "icon-nav-journey-mountain-active-amber" },
  tree: { category: "ui/icons/nav", id: "icon-nav-world-pagoda-active-green" },
  camp: { category: "ui/icons/nav", id: "icon-nav-camp-tent-active-amber" },
  study: { category: "ui/icons/nav", id: "icon-nav-study-book-active-green" },
  bag: { category: "ui/icons/nav", id: "icon-nav-bag-backpack-active-amber" },
  profile: { category: "ui/icons/nav", id: "icon-nav-profile-fox-active-gold" },
};

export const NAV_TAB_ICON_INACTIVE_ASSETS: Record<ImmersiveNavTab, ArtAssetRef> = {
  journey: { category: "ui/icons/nav", id: "icon-nav-journey-mountain-inactive" },
  tree: { category: "ui/icons/nav", id: "icon-nav-world-pagoda-inactive" },
  camp: { category: "ui/icons/nav", id: "icon-nav-camp-tent-inactive" },
  study: { category: "ui/icons/nav", id: "icon-nav-study-book-inactive" },
  bag: { category: "ui/icons/nav", id: "icon-nav-bag-backpack-inactive" },
  profile: { category: "ui/icons/nav", id: "icon-nav-profile-fox-inactive" },
};

export const NAV_TAB_MASCOT_ASSETS: Record<ImmersiveNavTab, ArtAssetRef> = {
  journey: { category: "characters/noboru/base", id: "char-noboru-walking-backpack" },
  tree: { category: "characters/noboru/base", id: "char-noboru-walking-backpack" },
  camp: { category: "characters/noboru/base", id: "char-noboru-sitting-campfire" },
  study: { category: "characters/noboru/base", id: "char-noboru-reading-book" },
  bag: { category: "characters/noboru/base", id: "char-noboru-walking-backpack" },
  profile: { category: "characters/noboru/base", id: "char-noboru-hero-profile" },
};

export const NAV_SKIN_TEXTURE_ASSETS: Record<NavPillSkinId, ArtAssetRef> = {
  ember_night: { category: "ui/navbars", id: "nav-ember-camp-active-camp" },
  trail_mist: { category: "ui/navbars", id: "nav-moonlit-journey-active-journey" },
  study_scroll: { category: "ui/navbars", id: "nav-app-dark-active-study" },
  travel_pack: { category: "ui/navbars", id: "nav-app-dark-active-bag" },
  stone_path: { category: "ui/navbars", id: "nav-premium-gold-profile-active-profile" },
  bamboo_grove: { category: "ui/navbars", id: "nav-bamboo-dojo-active-dojo" },
  moonlit_torii: { category: "ui/navbars", id: "nav-cosmic-world-active-world" },
  sakura_bloom: { category: "ui/navbars", id: "nav-light-sakura-parchment-active-camp" },
  winter_summit: { category: "ui/navbars", id: "nav-snow-journey-active-journey" },
  lantern_festival: { category: "ui/navbars", id: "nav-dark-camp-lantern-active-camp" },
  cherry_dawn: { category: "ui/navbars", id: "nav-light-sakura-parchment-active-camp" },
  cloud_sea: { category: "ui/navbars", id: "nav-cosmic-world-active-world" },
};

export const DOJO_ICON_ASSETS: Record<string, ArtAssetRef> = {
  review_queue: { category: "ui/icons/nodes", id: "icon-node-vocabulary" },
  kana_dojo: { category: "ui/icons/nodes", id: "icon-node-lesson-camp" },
  vocabulary_hall: { category: "ui/icons/nodes", id: "icon-node-vocabulary" },
  grammar_shrine: { category: "ui/icons/nodes", id: "icon-node-kanji" },
  listening_pavilion: { category: "ui/icons/nodes", id: "icon-node-listening" },
  kanji_grounds: { category: "ui/icons/nodes", id: "icon-node-kanji" },
  reading_library: { category: "ui/icons/nodes", id: "icon-node-vocabulary" },
};

export const WORLD_ICON_ASSETS: Record<string, ArtAssetRef> = {
  discover: { category: "ui/icons/nav", id: "icon-nav-world-compass-active-violet" },
  trails: { category: "ui/icons/nav", id: "icon-nav-journey-mountain-active-blue" },
  world_map: { category: "ui/icons/ui", id: "icon-ui-map" },
  trials: { category: "ui/icons/nodes", id: "icon-node-boss-mask" },
  games: { category: "ui/icons/ui", id: "icon-ui-gem" },
  community: { category: "ui/icons/ui", id: "icon-ui-globe-language" },
  collect: { category: "ui/icons/ui", id: "icon-ui-coin" },
  endgame: { category: "ui/icons/nodes", id: "icon-node-region-summit" },
};

export const HUB_ART_ASSETS: Record<string, ArtAssetRef> = {
  vocabulary: { category: "ui/icons/nodes", id: "icon-node-vocabulary" },
  grammar: { category: "ui/icons/nodes", id: "icon-node-kanji" },
  kanji: { category: "ui/icons/nodes", id: "icon-node-kanji" },
  reading: { category: "ui/icons/nodes", id: "icon-node-vocabulary" },
  listening: { category: "ui/icons/nodes", id: "icon-node-listening" },
  hiragana: { category: "ui/icons/nodes", id: "icon-node-lesson-camp" },
  katakana: { category: "ui/icons/nodes", id: "icon-node-lesson-camp" },
};

export const UI_ICON_ASSETS: Record<string, ArtAssetRef> = {
  chevron_down: { category: "ui/icons/ui", id: "icon-ui-chevron-right" },
  map: { category: "ui/icons/ui", id: "icon-ui-map" },
  settings: { category: "ui/icons/ui", id: "icon-ui-settings" },
  flame: { category: "ui/icons/ui", id: "icon-ui-flame-streak" },
  gem: { category: "ui/icons/ui", id: "icon-ui-gem" },
  trophy: { category: "rewards", id: "reward-badge-kanji-explorer" },
  gear: { category: "ui/icons/ui", id: "icon-ui-settings" },
  checkpoint: { category: "ui/icons/nodes", id: "icon-node-complete-check" },
  check: { category: "ui/icons/ui", id: "icon-ui-check" },
  lock: { category: "ui/icons/nodes", id: "icon-node-lock" },
  arrow_left: { category: "ui/icons/ui", id: "icon-ui-back" },
  clock: { category: "ui/icons/ui", id: "icon-ui-notification-bell" },
  zap: { category: "ui/icons/ui", id: "icon-ui-xp" },
  coins: { category: "ui/icons/ui", id: "icon-ui-coin" },
  mountain: { category: "ui/icons/nav", id: "icon-nav-journey-mountain-active-blue" },
};

export const GAME_ART_ASSETS: Record<string, ArtAssetRef> = {
  [GAME_SLUGS.wordMatch]: { category: "ui/icons/nodes", id: "icon-node-vocabulary" },
  [GAME_SLUGS.vocabularyRush]: { category: "ui/icons/ui", id: "icon-ui-xp" },
  [GAME_SLUGS.kanjiHunter]: { category: "ui/icons/nodes", id: "icon-node-kanji" },
  [GAME_SLUGS.memoryDungeon]: { category: "ui/icons/nodes", id: "icon-node-boss-mask" },
  [GAME_SLUGS.readingChallenge]: { category: "ui/icons/nodes", id: "icon-node-listening" },
};

export const ACHIEVEMENT_ART_ASSETS: Record<string, ArtAssetRef> = {
  [ACHIEVEMENT_SLUGS.firstStep]: { category: "rewards", id: "reward-xp-badge" },
  [ACHIEVEMENT_SLUGS.firstLesson]: { category: "rewards", id: "reward-badge-kanji-explorer" },
  [ACHIEVEMENT_SLUGS.tenLessons]: { category: "rewards", id: "reward-level-medallion-24" },
  [ACHIEVEMENT_SLUGS.hundredWords]: { category: "rewards", id: "reward-gem-purple" },
  [ACHIEVEMENT_SLUGS.fiftyKanji]: { category: "rewards", id: "reward-badge-kanji-explorer" },
  [ACHIEVEMENT_SLUGS.sevenDayStreak]: { category: "rewards", id: "reward-lantern" },
  [ACHIEVEMENT_SLUGS.n5Completed]: { category: "rewards", id: "reward-title-path-master" },
  [ACHIEVEMENT_SLUGS.memoryMaster]: { category: "rewards", id: "reward-trail-bamboo-forest" },
  [ACHIEVEMENT_SLUGS.gameChampion]: { category: "rewards", id: "reward-xp-badge" },
  [ACHIEVEMENT_SLUGS.perfectRecall]: { category: "rewards", id: "reward-gem-purple" },
  [ACHIEVEMENT_SLUGS.dungeonDelver]: { category: "rewards", id: "reward-lantern" },
};

export const BRAND_WORDMARK_ASSET: ArtAssetRef = {
  category: "brand",
  id: "brand-wordmark-noboru",
};

export const AUTH_ATMOSPHERE_ASSET: ArtAssetRef = {
  category: "backgrounds/camp",
  id: "bg-camp-loading",
};

/** Scene backgrounds per loading route profile (phase 1 uses existing camp/trail art). */
export const LOADING_SCENE_PROFILE_ASSETS = {
  default: AUTH_ATMOSPHERE_ASSET,
  home: AUTH_ATMOSPHERE_ASSET,
  learn: { category: "backgrounds/loading", id: "bg-loading-trail-moment-v1" },
  review: { category: "backgrounds/camp", id: "bg-camp-offline" },
  lesson: { category: "backgrounds/loading", id: "bg-loading-trail-moment-v1" },
  "region-transition": {
    category: "backgrounds/shrine",
    id: "bg-shrine-region-transition-torii",
  },
} as const satisfies Record<string, ArtAssetRef>;

/**
 * Final mockup-aligned loading backgrounds (phase 2 art pass).
 * Publish optimized WebP to public/art/backgrounds/loading/.
 */
export const LOADING_BACKGROUND_ASSETS = {
  camp_moment: { category: "backgrounds/loading", id: "bg-loading-camp-moment-v1" },
  trail_moment: { category: "backgrounds/loading", id: "bg-loading-trail-moment-v1" },
  study_moment: { category: "backgrounds/loading", id: "bg-loading-study-moment-v1" },
  region_enter: { category: "backgrounds/loading", id: "bg-loading-region-enter-v1" },
  region_leave: { category: "backgrounds/loading", id: "bg-loading-trail-moment-v1" },
} as const satisfies Record<string, ArtAssetRef>;

export const TRAIL_COMPANION_ASSET: ArtAssetRef = {
  category: "characters/noboru/base",
  id: "char-noboru-walking-backpack",
};

/** Doc 11 camp world hotspots — quest board, chest, shrine, merchant, tent. */
export const JOURNEY_WORLD_ASSETS = {
  region_gate: { category: "backgrounds/shrine", id: "bg-shrine-region-transition-torii" },
  region_unlock_fox: {
    category: "characters/noboru/base",
    id: "char-noboru-from-behind-region-transition",
  },
  trail_lantern: { category: "props/inventory", id: "item-stone-lantern" },
  boss_atmosphere: { category: "backgrounds/shrine", id: "bg-shrine-boss-atmosphere" },
} as const satisfies Record<string, ArtAssetRef>;

export const CAMP_WORLD_ASSETS = {
  quest_board: { category: "ui/panels", id: "panel-wood-daily-quest-board" },
  chest_closed: { category: "props/camp", id: "prop-camp-chest-closed" },
  chest_available: { category: "props/camp", id: "prop-camp-chest-available" },
  chest_opening: { category: "props/camp", id: "prop-camp-chest-opening" },
  chest_collected: { category: "props/camp", id: "prop-camp-chest-collected" },
  shrine_lantern: { category: "props/camp", id: "prop-camp-shrine-lantern-stone" },
  shrine_lantern_paper: { category: "props/camp", id: "prop-camp-shrine-lantern-paper" },
  shrine_glow: { category: "props/camp", id: "prop-camp-shrine-lantern-glow" },
  merchant: { category: "props/camp", id: "prop-camp-merchant-stand" },
  merchant_scene: { category: "backgrounds/utility", id: "bg-shop-general-store-dark" },
  tent: { category: "props/camp", id: "prop-camp-tent-canvas" },
  ember_particle: { category: "props/particles", id: "particle-ember" },
  campfire_fox: { category: "characters/noboru/base", id: "char-noboru-sitting-campfire" },
  campfire_fox_happy: { category: "characters/noboru/reactions", id: "char-noboru-reaction-happy" },
  campfire_fox_proud: { category: "characters/noboru/reactions", id: "char-noboru-reaction-proud" },
  campfire_fox_excited: { category: "characters/noboru/reactions", id: "char-noboru-reaction-excited" },
  campfire_fox_worried: { category: "characters/noboru/reactions", id: "char-noboru-reaction-worried" },
  campfire_fox_oops: { category: "characters/noboru/reactions", id: "char-noboru-reaction-oops" },
  campfire_fox_encouraging: {
    category: "characters/noboru/reactions",
    id: "char-noboru-reaction-encouraging",
  },
  campfire_fox_peek: { category: "characters/noboru/base", id: "char-noboru-peeking-locked-detail" },
  memory_book: { category: "props/camp", id: "prop-camp-memory-book-closed" },
  achievement_shrine: { category: "backgrounds/shrine", id: "bg-shrine-achievements" },
} as const satisfies Record<string, ArtAssetRef>;

import { artLibraryPath, type ArtLibraryTheme } from "@/lib/assets/art-library-paths";
import { mapLegacyAssetToArtLibrary } from "@/lib/assets/legacy-art-library-map";

function resolveTheme(theme?: string): ArtLibraryTheme {
  return theme === "light" ? "light" : "dark";
}

/** Resolve legacy ArtAssetRef to a published WebP URL under /art-library/. */
export function resolveArtAsset(ref: ArtAssetRef, theme?: string): string {
  const resolvedTheme = resolveTheme(theme);
  const relativePath = mapLegacyAssetToArtLibrary(ref, resolvedTheme);
  return relativePath ? artLibraryPath(relativePath) : "";
}
