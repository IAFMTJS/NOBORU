import {
  IMMERSIVE_NAV_TAB_CONFIG,
  type ImmersiveNavTab,
  type ImmersiveNavTabConfig,
} from "@/lib/navigation/immersive-nav.constants";

/** Resolves pill-bar skin config (texture path, glow tokens, mascot mood) for an immersive nav tab. */
export function resolveNavSkin(tab: ImmersiveNavTab): ImmersiveNavTabConfig {
  return IMMERSIVE_NAV_TAB_CONFIG[tab];
}
