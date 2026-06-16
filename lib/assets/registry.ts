/**
 * Art-direction asset registry — maps app APIs to /art/* paths per art-direction spec.
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
  type TrailScrollRegionSlug,
} from "@/lib/design-system/regions";
import type { NavPillSkinId } from "@/lib/navigation/nav-skin.resolver";
import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";

export { TRAIL_SCROLL_REGION_SLUGS, type TrailScrollRegionSlug } from "@/lib/design-system/regions";

export const ASSET_REGISTRY = {
  root: "/art",
  marketing: "/assets/marketing",
} as const;

function themeSuffix(theme?: string): "dark" | "light" {
  return theme === "light" ? "light" : "dark";
}

export function getMascotPath(theme?: string): string {
  void themeSuffix(theme);
  return resolveArtAsset(TRAIL_COMPANION_ASSET);
}

export function getNoboruPosePath(poseId?: NoboruPoseId): string | null {
  if (!poseId) return null;
  const ref = NOBORU_POSE_ASSETS[poseId];
  return ref ? resolveArtAsset(ref) : null;
}

export function getYamaExpressionPath(
  expression?: string,
  theme?: string,
  poseId?: NoboruPoseId,
): string | null {
  void theme;
  const posePath = getNoboruPosePath(poseId);
  if (posePath) return posePath;
  if (!expression) return resolveArtAsset(YAMA_EXPRESSION_ASSETS.main);
  const ref = YAMA_EXPRESSION_ASSETS[expression as keyof typeof YAMA_EXPRESSION_ASSETS];
  return ref ? resolveArtAsset(ref) : null;
}

export function getAchievementArtPath(slug?: string): string | null {
  if (!slug) return null;
  const ref = ACHIEVEMENT_ART_ASSETS[slug];
  return ref ? resolveArtAsset(ref) : resolveArtAsset(ACHIEVEMENT_ART_ASSETS["first-lesson"]!);
}

export function getGameArtPath(slug?: string): string | null {
  if (!slug) return null;
  const ref = GAME_ART_ASSETS[slug];
  return ref ? resolveArtAsset(ref) : null;
}

export function getNavIconPath(tab?: string, active = true): string | null {
  if (!tab) return null;
  const key = tab as ImmersiveNavTab;
  const ref = active ? NAV_TAB_ICON_ASSETS[key] : NAV_TAB_ICON_INACTIVE_ASSETS[key];
  return ref ? resolveArtAsset(ref) : null;
}

export function getNavFoxPath(tab?: string, theme?: string): string | null {
  void theme;
  if (!tab) return null;
  const ref = NAV_TAB_MASCOT_ASSETS[tab as ImmersiveNavTab];
  return ref ? resolveArtAsset(ref) : null;
}

export function getUiIconPath(name?: string): string | null {
  if (!name) return null;
  const ref = UI_ICON_ASSETS[name];
  return ref ? resolveArtAsset(ref) : null;
}

export function getDojoIconPath(slug?: string): string | null {
  if (!slug) return null;
  const ref = DOJO_ICON_ASSETS[slug];
  return ref ? resolveArtAsset(ref) : null;
}

export function getWorldIconPath(slug?: string): string | null {
  if (!slug) return null;
  const ref = WORLD_ICON_ASSETS[slug];
  return ref ? resolveArtAsset(ref) : null;
}

export function getHubArtPath(slug?: string): string | null {
  if (!slug) return null;
  const ref = HUB_ART_ASSETS[slug];
  return ref ? resolveArtAsset(ref) : null;
}

export function getCampWorldArtPath(
  key?: keyof typeof CAMP_WORLD_ASSETS,
): string | null {
  if (!key) return null;
  return resolveArtAsset(CAMP_WORLD_ASSETS[key]);
}

export function getTrailCompanionPath(theme?: string): string | null {
  void theme;
  return resolveArtAsset(TRAIL_COMPANION_ASSET);
}

export function getYamaTrailCompanionPath(theme?: string): string | null {
  return getTrailCompanionPath(theme);
}

export function getSceneArtPath(scene?: string, theme?: string): string | null {
  void theme;
  if (!scene) return null;
  const ref = SCENE_BACKGROUND_ASSETS[scene as SceneId];
  return ref ? resolveArtAsset(ref) : null;
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

export function getRegionArtPath(slug?: string): string | null {
  if (!slug) return null;
  const ref = REGION_HERO_ASSETS[slug as keyof typeof REGION_HERO_ASSETS];
  return ref ? resolveArtAsset(ref) : null;
}

export function getTrailSpineArtPath(theme?: string): string | null {
  void theme;
  return resolveArtAsset(TRAIL_SPINE_ASSET);
}

export function getTrailScrollArtPath(
  regionSlug?: string,
  theme?: string,
  trailSegmentIndex?: number,
): string | null {
  void theme;
  void trailSegmentIndex;
  if (!regionSlug) return null;
  const ref = REGION_TRAIL_SCROLL_ASSETS[regionSlug as keyof typeof REGION_TRAIL_SCROLL_ASSETS];
  return ref ? resolveArtAsset(ref) : null;
}

export function hasTrailScrollArt(regionSlug?: string): boolean {
  if (!regionSlug) return false;
  return (TRAIL_SCROLL_REGION_SLUGS as readonly string[]).includes(regionSlug);
}

export function getWordmarkPath(theme?: string): string | null {
  void theme;
  return resolveArtAsset(BRAND_WORDMARK_ASSET);
}

export function getAuthAtmospherePath(theme?: string): string | null {
  void theme;
  return resolveArtAsset(AUTH_ATMOSPHERE_ASSET);
}

export function getLoadingScenePath(
  profile: keyof typeof LOADING_SCENE_PROFILE_ASSETS = "default",
  theme?: string,
): string | null {
  void theme;
  const ref =
    LOADING_SCENE_PROFILE_ASSETS[profile] ?? LOADING_SCENE_PROFILE_ASSETS.default;
  return resolveArtAsset(ref);
}

export function getNavSkinTexturePath(skinId: NavPillSkinId): string {
  const ref = NAV_SKIN_TEXTURE_ASSETS[skinId];
  return resolveArtAsset(ref);
}
