/**
 * Art-direction asset registry — maps app APIs to published Art Library paths.
 */
import {
  ACHIEVEMENT_ART_ASSETS,
  AUTH_ATMOSPHERE_ASSET,
  BRAND_WORDMARK_ASSET,
  CAMP_WORLD_ASSETS,
  DOJO_ICON_ASSETS,
  GAME_ART_ASSETS,
  HUB_ART_ASSETS,
  NAV_SKIN_TEXTURE_ASSETS,
  NAV_TAB_ICON_ASSETS,
  NAV_TAB_ICON_INACTIVE_ASSETS,
  NAV_TAB_MASCOT_ASSETS,
  LOADING_SCENE_PROFILE_ASSETS,
  REGION_HERO_ASSETS,
  REGION_TRAIL_SCROLL_ASSETS,
  SCENE_BACKGROUND_ASSETS,
  TRAIL_COMPANION_ASSET,
  TRAIL_SPINE_ASSET,
  UI_ICON_ASSETS,
  WORLD_ICON_ASSETS,
  NOBORU_POSE_ASSETS,
  YAMA_EXPRESSION_ASSETS,
  resolveArtAsset,
} from "@/lib/assets/art-mappings";
import type { NoboruPoseId } from "@/lib/assets/art-mappings";
import type { SceneId } from "@/components/media/scene-image";
import {
  TRAIL_SCROLL_REGION_SLUGS,
} from "@/lib/design-system/regions";
import type { NavPillSkinId } from "@/lib/navigation/nav-skin.resolver";
import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";

export { TRAIL_SCROLL_REGION_SLUGS, type TrailScrollRegionSlug } from "@/lib/design-system/regions";

export const ASSET_REGISTRY = {
  root: "/api/art-library",
  marketing: "/assets/marketing",
} as const;

export function getMascotPath(theme?: string): string {
  return resolveArtAsset(TRAIL_COMPANION_ASSET, theme);
}

export function getNoboruPosePath(poseId?: NoboruPoseId, theme?: string): string | null {
  if (!poseId) return null;
  const ref = NOBORU_POSE_ASSETS[poseId];
  return ref ? resolveArtAsset(ref, theme) : null;
}

export function getYamaExpressionPath(
  expression?: string,
  theme?: string,
  poseId?: NoboruPoseId,
): string | null {
  const posePath = getNoboruPosePath(poseId, theme);
  if (posePath) return posePath;
  if (!expression) return resolveArtAsset(YAMA_EXPRESSION_ASSETS.main, theme);
  const ref = YAMA_EXPRESSION_ASSETS[expression as keyof typeof YAMA_EXPRESSION_ASSETS];
  return ref ? resolveArtAsset(ref, theme) : null;
}

export function getAchievementArtPath(slug?: string, theme?: string): string | null {
  if (!slug) return null;
  const ref = ACHIEVEMENT_ART_ASSETS[slug];
  return ref
    ? resolveArtAsset(ref, theme)
    : resolveArtAsset(ACHIEVEMENT_ART_ASSETS["first-lesson"]!, theme);
}

export function getGameArtPath(slug?: string, theme?: string): string | null {
  if (!slug) return null;
  const ref = GAME_ART_ASSETS[slug];
  return ref ? resolveArtAsset(ref, theme) : null;
}

export function getNavIconPath(tab?: string, active = true, theme?: string): string | null {
  if (!tab) return null;
  const key = tab as ImmersiveNavTab;
  const ref = active ? NAV_TAB_ICON_ASSETS[key] : NAV_TAB_ICON_INACTIVE_ASSETS[key];
  return ref ? resolveArtAsset(ref, theme) : null;
}

export function getNavFoxPath(tab?: string, theme?: string): string | null {
  if (!tab) return null;
  const ref = NAV_TAB_MASCOT_ASSETS[tab as ImmersiveNavTab];
  return ref ? resolveArtAsset(ref, theme) : null;
}

export function getUiIconPath(name?: string, theme?: string): string | null {
  if (!name) return null;
  const ref = UI_ICON_ASSETS[name];
  return ref ? resolveArtAsset(ref, theme) : null;
}

export function getDojoIconPath(slug?: string, theme?: string): string | null {
  if (!slug) return null;
  const ref = DOJO_ICON_ASSETS[slug];
  return ref ? resolveArtAsset(ref, theme) : null;
}

export function getWorldIconPath(slug?: string, theme?: string): string | null {
  if (!slug) return null;
  const ref = WORLD_ICON_ASSETS[slug];
  return ref ? resolveArtAsset(ref, theme) : null;
}

export function getHubArtPath(slug?: string, theme?: string): string | null {
  if (!slug) return null;
  const ref = HUB_ART_ASSETS[slug];
  return ref ? resolveArtAsset(ref, theme) : null;
}

export function getCampWorldArtPath(
  key?: keyof typeof CAMP_WORLD_ASSETS,
  theme?: string,
): string | null {
  if (!key) return null;
  return resolveArtAsset(CAMP_WORLD_ASSETS[key], theme);
}

export function getTrailCompanionPath(theme?: string): string | null {
  return resolveArtAsset(TRAIL_COMPANION_ASSET, theme);
}

export function getYamaTrailCompanionPath(theme?: string): string | null {
  return getTrailCompanionPath(theme);
}

export function getSceneArtPath(scene?: string, theme?: string): string | null {
  if (!scene) return null;
  const ref = SCENE_BACKGROUND_ASSETS[scene as SceneId];
  return ref ? resolveArtAsset(ref, theme) : null;
}

export function getNavTabMascotExpression(tab: string): string {
  const expressions: Record<string, string> = {
    journey: "adventure",
    camp: "encouraging",
    study: "studying",
    bag: "adventure",
    profile: "victorious",
  };
  return expressions[tab] ?? "main";
}

export function getRegionArtPath(slug?: string, theme?: string): string | null {
  if (!slug) return null;
  const ref = REGION_HERO_ASSETS[slug as keyof typeof REGION_HERO_ASSETS];
  return ref ? resolveArtAsset(ref, theme) : null;
}

export function getTrailSpineArtPath(theme?: string): string | null {
  return resolveArtAsset(TRAIL_SPINE_ASSET, theme);
}

export function getTrailScrollArtPath(
  regionSlug?: string,
  theme?: string,
  trailSegmentIndex?: number,
): string | null {
  void trailSegmentIndex;
  if (!regionSlug) return null;
  const ref = REGION_TRAIL_SCROLL_ASSETS[regionSlug as keyof typeof REGION_TRAIL_SCROLL_ASSETS];
  return ref ? resolveArtAsset(ref, theme) : null;
}

export function hasTrailScrollArt(regionSlug?: string): boolean {
  if (!regionSlug) return false;
  return (TRAIL_SCROLL_REGION_SLUGS as readonly string[]).includes(regionSlug);
}

export function getWordmarkPath(theme?: string): string | null {
  return resolveArtAsset(BRAND_WORDMARK_ASSET, theme);
}

export function getAuthAtmospherePath(theme?: string): string | null {
  return resolveArtAsset(AUTH_ATMOSPHERE_ASSET, theme);
}

export function getLoadingScenePath(
  profile: keyof typeof LOADING_SCENE_PROFILE_ASSETS = "default",
  theme?: string,
): string | null {
  const ref =
    LOADING_SCENE_PROFILE_ASSETS[profile] ?? LOADING_SCENE_PROFILE_ASSETS.default;
  return resolveArtAsset(ref, theme);
}

export function getNavSkinTexturePath(skinId: NavPillSkinId, theme?: string): string {
  const ref = NAV_SKIN_TEXTURE_ASSETS[skinId];
  return resolveArtAsset(ref, theme);
}
