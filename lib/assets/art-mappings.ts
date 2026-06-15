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
  dojo_forest: { category: "backgrounds/events", id: "bg-event-bamboo-forest-unlocked" },
  shrine_torii: { category: "backgrounds/shrine", id: "bg-shrine-achievements" },
  world_map_peaks: { category: "backgrounds/trail", id: "bg-trail-world-overview" },
  shop_interior: { category: "backgrounds/utility", id: "bg-shop-general-store-dark" },
  lesson_complete: { category: "backgrounds/shrine", id: "bg-shrine-lesson-complete-path" },
  checkpoint_shrine: { category: "backgrounds/shrine", id: "bg-shrine-checkpoint" },
  memory_book_journal: { category: "backgrounds/utility", id: "bg-memory-book-frame" },
  seasonal_sakura: { category: "backgrounds/events", id: "bg-event-sakura-trail" },
  social_gathering: { category: "backgrounds/utility", id: "bg-social-leaderboard-dark" },
  inventory_backpack: { category: "backgrounds/camp", id: "bg-camp-home-night" },
  review_atmosphere: { category: "backgrounds/camp", id: "bg-camp-offline" },
  study_atmosphere: { category: "backgrounds/trail", id: "bg-trail-forest-current-night" },
  profile_lantern_path: { category: "backgrounds/utility", id: "bg-settings-dark-panel" },
};

/** Tall vertical scroll art per journey region (1536×5120). */
export const REGION_TRAIL_SCROLL_ASSETS: Record<RegionSlug, ArtAssetRef> = {
  foothills: { category: "backgrounds/trail", id: "bg-trail-scroll-foothills" },
  "forest-trail": { category: "backgrounds/trail", id: "bg-trail-scroll-forest-trail" },
  "mount-n5": { category: "backgrounds/trail", id: "bg-trail-scroll-mount-n5" },
  "mount-n4": { category: "backgrounds/trail", id: "bg-trail-scroll-mount-n4" },
  "mount-n3": { category: "backgrounds/trail", id: "bg-trail-scroll-mount-n3" },
  "mount-n2": { category: "backgrounds/trail", id: "bg-trail-scroll-mount-n2" },
  "mount-n1": { category: "backgrounds/trail", id: "bg-trail-scroll-mount-n1" },
  "master-summit": { category: "backgrounds/trail", id: "bg-trail-scroll-master-summit" },
};

export const REGION_HERO_ASSETS: Record<RegionSlug, ArtAssetRef> = {
  foothills: { category: "backgrounds/trail", id: "bg-trail-foot-hills-night" },
  "forest-trail": { category: "backgrounds/trail", id: "bg-trail-forest-current-night" },
  "mount-n5": { category: "backgrounds/trail", id: "bg-trail-long-region" },
  "mount-n4": { category: "backgrounds/trail", id: "bg-trail-long-region" },
  "mount-n3": { category: "backgrounds/trail", id: "bg-trail-temple-peak-locked" },
  "mount-n2": { category: "backgrounds/trail", id: "bg-trail-temple-peak-locked" },
  "mount-n1": { category: "backgrounds/trail", id: "bg-trail-temple-peak-boss" },
  "master-summit": { category: "backgrounds/trail", id: "bg-trail-multi-region-panorama" },
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

export const NAV_TAB_ICON_ASSETS: Record<ImmersiveNavTab, ArtAssetRef> = {
  camp: { category: "ui/icons/nav", id: "icon-nav-camp-tent-active-amber" },
  journey: { category: "ui/icons/nav", id: "icon-nav-journey-mountain-active-blue" },
  dojo: { category: "ui/icons/nav", id: "icon-nav-dojo-torii-active-green" },
  world: { category: "ui/icons/nav", id: "icon-nav-world-pagoda-active-violet" },
  profile: { category: "ui/icons/nav", id: "icon-nav-profile-fox-active-gold" },
};

export const NAV_TAB_ICON_INACTIVE_ASSETS: Record<ImmersiveNavTab, ArtAssetRef> = {
  camp: { category: "ui/icons/nav", id: "icon-nav-camp-tent-inactive" },
  journey: { category: "ui/icons/nav", id: "icon-nav-journey-mountain-inactive" },
  dojo: { category: "ui/icons/nav", id: "icon-nav-dojo-torii-inactive" },
  world: { category: "ui/icons/nav", id: "icon-nav-world-pagoda-inactive" },
  profile: { category: "ui/icons/nav", id: "icon-nav-profile-fox-inactive" },
};

export const NAV_TAB_MASCOT_ASSETS: Record<ImmersiveNavTab, ArtAssetRef> = {
  camp: { category: "characters/noboru/base", id: "char-noboru-sitting-campfire" },
  journey: { category: "characters/noboru/base", id: "char-noboru-walking-backpack" },
  dojo: { category: "characters/noboru/base", id: "char-noboru-meditating-dojo" },
  world: { category: "characters/noboru/base", id: "char-noboru-telescope-world" },
  profile: { category: "characters/noboru/base", id: "char-noboru-hero-profile" },
};

export const NAV_SKIN_TEXTURE_ASSETS: Record<NavPillSkinId, ArtAssetRef> = {
  ember_night: { category: "ui/navbars", id: "nav-ember-camp-active-camp" },
  trail_mist: { category: "ui/navbars", id: "nav-moonlit-journey-active-journey" },
  bamboo_grove: { category: "ui/navbars", id: "nav-bamboo-dojo-active-dojo" },
  moonlit_torii: { category: "ui/navbars", id: "nav-cosmic-world-active-world" },
  stone_path: { category: "ui/navbars", id: "nav-premium-gold-profile-active-profile" },
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

export const TRAIL_COMPANION_ASSET: ArtAssetRef = {
  category: "characters/noboru/base",
  id: "char-noboru-walking-backpack",
};

export const TRAIL_SPINE_ASSET: ArtAssetRef = {
  category: "ui/progress",
  id: "scroll-indicator-trail-vertical",
};

export function resolveArtAsset(ref: ArtAssetRef): string {
  return `/art/${ref.category}/${ref.id}.webp`;
}
