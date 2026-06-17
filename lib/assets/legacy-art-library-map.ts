import type { ArtLibraryTheme } from "@/lib/assets/art-library-paths";
import type { ArtAssetRef } from "@/lib/assets/art-mappings";

function kebabToSnake(value: string): string {
  return value.replace(/-/g, "_");
}

function withTheme(basePath: string, theme: ArtLibraryTheme): string {
  return `${basePath}_${theme}_v1.png`;
}

const LEGACY_BACKGROUND_BASE: Record<string, string> = {
  "bg-camp-home-night": "backgrounds/camp/bg_camp",
  "bg-camp-loading": "backgrounds/camp/bg_camp_lantern",
  "bg-camp-offline": "backgrounds/camp/bg_camp",
  "bg-camp-daily-quests": "backgrounds/camp/bg_camp",
  "bg-trail-forest-current-night": "backgrounds/trail/bg_trail",
  "bg-trail-foot-hills-night": "backgrounds/trail/bg_trail",
  "bg-trail-world-overview": "backgrounds/trail/bg_trail",
  "bg-trail-temple-peak-boss": "backgrounds/trail/bg_trail",
  "bg-trail-temple-peak-locked": "backgrounds/trail/bg_trail",
  "bg-trail-multi-region-panorama": "backgrounds/trail/bg_trail",
  "bg-trail-scroll-forest-trail": "backgrounds/trail/bg_trail_bamboo",
  "bg-trail-scroll-mount-n5": "backgrounds/trail/bg_trail",
  "bg-trail-scroll-mount-n4": "backgrounds/trail/bg_trail",
  "bg-trail-scroll-mount-n3": "backgrounds/trail/bg_trail",
  "bg-trail-scroll-mount-n2": "backgrounds/trail/bg_trail",
  "bg-trail-scroll-mount-n1": "backgrounds/trail/bg_trail",
  "bg-trail-scroll-master-summit": "backgrounds/trail/bg_trail",
  "bg-shrine-achievements": "backgrounds/shrine/bg_shrine",
  "bg-shrine-checkpoint": "backgrounds/shrine/bg_shrine",
  "bg-shrine-lesson-complete-path": "backgrounds/shrine/bg_shrine",
  "bg-shrine-region-transition-torii": "backgrounds/shrine/bg_shrine_lantern",
  "bg-event-bamboo-forest-unlocked": "backgrounds/trail/bg_trail_bamboo",
  "bg-event-sakura-trail": "backgrounds/trail/bg_trail_sakura",
  "bg-shop-general-store-dark": "backgrounds/camp/bg_camp",
  "bg-social-leaderboard-dark": "backgrounds/core/bg_core",
  "bg-memory-book-frame": "backgrounds/shrine/bg_shrine",
  "bg-settings-dark-panel": "backgrounds/core/bg_core",
  "bg-loading-camp-moment-v1": "backgrounds/camp/bg_camp",
  "bg-loading-trail-moment-v1": "backgrounds/trail/bg_trail",
  "bg-loading-study-moment-v1": "backgrounds/study/bg_study",
  "bg-loading-region-enter-v1": "backgrounds/shrine/bg_shrine_lantern",
  "bg-loading-region-leave-v1": "backgrounds/trail/bg_trail",
};

const NOBORU_BASE_MAP: Record<string, string> = {
  "char-noboru-from-behind-region-transition": "characters/kitsune/base/kitsune_from_behind",
  "char-noboru-hero-profile": "characters/kitsune/base/kitsune_hero_profile",
  "char-noboru-meditating-dojo": "characters/kitsune/base/kitsune_meditating_dojo",
  "char-noboru-peeking-locked-detail": "characters/kitsune/base/kitsune_peeking_corner",
  "char-noboru-reading-book": "characters/kitsune/base/kitsune_reading_book",
  "char-noboru-running-ember": "characters/kitsune/base/kitsune_running_ember",
  "char-noboru-sitting-campfire": "characters/kitsune/base/kitsune_sitting_campfire",
  "char-noboru-standing-traveler": "characters/kitsune/base/kitsune_standing_traveler",
  "char-noboru-telescope-world": "characters/kitsune/base/kitsune_telescope_world",
  "char-noboru-walking-backpack": "characters/kitsune/base/kitsune_walking_backpack",
  "char-noboru-winter-staff": "characters/kitsune/weather/kitsune_snowy_cloak",
};

const NOBORU_REACTION_MAP: Record<string, string> = {
  "char-noboru-reaction-encouraging": "characters/kitsune/reactions/kitsune_encouraging",
  "char-noboru-reaction-excited": "characters/kitsune/reactions/kitsune_excited",
  "char-noboru-reaction-happy": "characters/kitsune/reactions/kitsune_happy",
  "char-noboru-reaction-mastery": "characters/kitsune/reactions/kitsune_mastery",
  "char-noboru-reaction-oops": "characters/kitsune/reactions/kitsune_oops",
  "char-noboru-reaction-out-of-hearts": "characters/kitsune/reactions/kitsune_oops",
  "char-noboru-reaction-proud": "characters/kitsune/reactions/kitsune_proud",
  "char-noboru-reaction-teaching": "characters/kitsune/reactions/kitsune_teaching",
  "char-noboru-reaction-worried": "characters/kitsune/reactions/kitsune_worried",
};

const NOBORU_WEATHER_MAP: Record<string, string> = {
  "char-noboru-weather-night-lantern": "characters/kitsune/weather/kitsune_night_lantern",
  "char-noboru-weather-rainy-umbrella": "characters/kitsune/weather/kitsune_rainy_umbrella",
  "char-noboru-weather-snowy-cloak": "characters/kitsune/weather/kitsune_snowy_cloak",
  "char-noboru-weather-sunny": "characters/kitsune/weather/kitsune_sunny",
};

const NOBORU_COSMETIC_MAP: Record<string, string> = {
  "char-noboru-cosmetic-backpack-bamboo": "characters/kitsune/personalization/kitsune_cosmetic_backpack",
  "char-noboru-cosmetic-fox-mask": "characters/kitsune/personalization/kitsune_cosmetic_mask",
  "char-noboru-cosmetic-preview-base": "characters/kitsune/personalization/kitsune_bust_avatar",
  "char-noboru-cosmetic-scarf-crimson": "characters/kitsune/personalization/kitsune_cosmetic_scarf",
};

function mapNoboruCharacter(id: string): string | null {
  return (
    NOBORU_BASE_MAP[id] ??
    NOBORU_REACTION_MAP[id] ??
    NOBORU_WEATHER_MAP[id] ??
    NOBORU_COSMETIC_MAP[id] ??
    null
  );
}

function mapIcon(id: string): string {
  const base = id.replace(/-active-[a-z]+$/i, "").replace(/-inactive$/i, "");
  return `icons/${kebabToSnake(base)}`;
}

function mapInventoryItem(id: string): string {
  return `props/${kebabToSnake(id)}`;
}

function mapReward(id: string): string {
  return `achievements/${kebabToSnake(id)}`;
}

/** Map legacy ArtAssetRef to a relative Art Library path (with theme suffix). */
export function mapLegacyAssetToArtLibrary(
  ref: ArtAssetRef,
  theme: ArtLibraryTheme = "dark",
): string | null {
  const { category, id } = ref;

  if (category.startsWith("backgrounds/")) {
    const base = LEGACY_BACKGROUND_BASE[id];
    if (base) return withTheme(base, theme);
  }

  if (category.startsWith("characters/noboru")) {
    const base = mapNoboruCharacter(id);
    if (base) return withTheme(base, theme);
  }

  if (category.startsWith("ui/icons") || category === "brand") {
    if (id === "brand-wordmark-noboru") {
      return withTheme("icons/brand_wordmark", theme);
    }
    return withTheme(mapIcon(id), theme);
  }

  if (category === "rewards") {
    return withTheme(mapReward(id), theme);
  }

  if (category.startsWith("props/inventory")) {
    return withTheme(mapInventoryItem(id), theme);
  }

  if (category.startsWith("props/")) {
    if (id.startsWith("item-")) {
      return withTheme(mapInventoryItem(id), theme);
    }
  }

  return null;
}
