import { getNavSkinTexturePath } from "@/lib/assets/registry";
import {
  IMMERSIVE_NAV_TAB_CONFIG,
  type ImmersiveNavTab,
  type ImmersiveNavTabConfig,
} from "@/lib/navigation/immersive-nav.constants";
import { resolveNavTabFromPath } from "@/lib/navigation/is-nav-active";

/** All immersive nav pill skin IDs (5 tab defaults + seasonal variants). */
export const NAV_PILL_SKIN_IDS = [
  "ember_night",
  "trail_mist",
  "study_scroll",
  "travel_pack",
  "stone_path",
  "bamboo_grove",
  "moonlit_torii",
  "sakura_bloom",
  "winter_summit",
  "lantern_festival",
  "cherry_dawn",
  "cloud_sea",
] as const;

export type NavPillSkinId = (typeof NAV_PILL_SKIN_IDS)[number];
export type NavSkinSeason = "spring" | "summer" | "autumn" | "winter";

const SEASON_SKIN_BY_TAB: Record<NavSkinSeason, Record<ImmersiveNavTab, NavPillSkinId>> = {
  spring: {
    journey: "cherry_dawn",
    camp: "sakura_bloom",
    study: "bamboo_grove",
    bag: "travel_pack",
    profile: "stone_path",
  },
  summer: {
    journey: "trail_mist",
    camp: "ember_night",
    study: "study_scroll",
    bag: "travel_pack",
    profile: "stone_path",
  },
  autumn: {
    journey: "trail_mist",
    camp: "ember_night",
    study: "study_scroll",
    bag: "travel_pack",
    profile: "stone_path",
  },
  winter: {
    journey: "winter_summit",
    camp: "ember_night",
    study: "study_scroll",
    bag: "travel_pack",
    profile: "stone_path",
  },
};

function withSkinId(config: ImmersiveNavTabConfig, skinId: NavPillSkinId): ImmersiveNavTabConfig {
  if (config.skinId === skinId) {
    return config;
  }

  return {
    ...config,
    skinId,
    barTexturePath: getNavSkinTexturePath(skinId),
  };
}

/** Resolves pill-bar skin config (texture path, glow tokens, mascot mood) for an immersive nav tab. */
export function resolveNavSkin(tab: ImmersiveNavTab): ImmersiveNavTabConfig {
  const base = IMMERSIVE_NAV_TAB_CONFIG[tab];
  return withSkinId(base, base.skinId as NavPillSkinId);
}

/**
 * Route-aware skin resolver — picks from nav pill skins.
 * Without `season`, returns the tab default from `IMMERSIVE_NAV_TAB_CONFIG`.
 * With `season`, maps each tab to a seasonal skin variant.
 */
export function resolveNavSkinWithContext(
  route: string,
  season?: NavSkinSeason,
): ImmersiveNavTabConfig {
  const tab = resolveNavTabFromPath(route.startsWith("/") ? route : `/${route}`);
  const base = IMMERSIVE_NAV_TAB_CONFIG[tab];

  if (!season) {
    return base;
  }

  return withSkinId(base, SEASON_SKIN_BY_TAB[season][tab]);
}
