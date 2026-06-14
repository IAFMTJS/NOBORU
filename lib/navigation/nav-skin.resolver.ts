import { getNavSkinTexturePath } from "@/lib/assets/registry";
import {
  IMMERSIVE_NAV_TAB_CONFIG,
  type ImmersiveNavTab,
  type ImmersiveNavTabConfig,
} from "@/lib/navigation/immersive-nav.constants";
import { PRIMARY_NAV_ITEMS } from "@/lib/navigation/primary-nav";

/** All 10 immersive nav pill skin IDs (5 tab defaults + 5 seasonal). */
export const NAV_PILL_SKIN_IDS = [
  "ember_night",
  "trail_mist",
  "bamboo_grove",
  "moonlit_torii",
  "stone_path",
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
    camp: "sakura_bloom",
    journey: "cherry_dawn",
    dojo: "bamboo_grove",
    world: "moonlit_torii",
    profile: "stone_path",
  },
  summer: {
    camp: "ember_night",
    journey: "trail_mist",
    dojo: "bamboo_grove",
    world: "lantern_festival",
    profile: "stone_path",
  },
  autumn: {
    camp: "ember_night",
    journey: "trail_mist",
    dojo: "bamboo_grove",
    world: "moonlit_torii",
    profile: "stone_path",
  },
  winter: {
    camp: "ember_night",
    journey: "winter_summit",
    dojo: "bamboo_grove",
    world: "cloud_sea",
    profile: "stone_path",
  },
};

function resolveTabFromRoute(route: string): ImmersiveNavTab {
  const pathname = route.startsWith("/") ? route : `/${route}`;

  for (const item of PRIMARY_NAV_ITEMS) {
    if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
      return item.navTab;
    }
  }

  if (pathname === "/home" || pathname.startsWith("/home/")) {
    return "camp";
  }

  return "camp";
}

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
  return IMMERSIVE_NAV_TAB_CONFIG[tab];
}

/**
 * Route-aware skin resolver stub — picks from the 10 nav pill skins.
 * Without `season`, returns the tab default from `IMMERSIVE_NAV_TAB_CONFIG`.
 * With `season`, maps each tab to a seasonal skin variant.
 */
export function resolveNavSkinWithContext(
  route: string,
  season?: NavSkinSeason,
): ImmersiveNavTabConfig {
  const tab = resolveTabFromRoute(route);
  const base = IMMERSIVE_NAV_TAB_CONFIG[tab];

  if (!season) {
    return base;
  }

  return withSkinId(base, SEASON_SKIN_BY_TAB[season][tab]);
}
