/**
 * Canonical public asset paths.
 * Source of truth: assets/ with metadata.json per asset-pipeline.md
 */
export const ASSET_REGISTRY = {
  mascots: {
    yamaMainLight: "/mascots/yama_main_light_v1.webp",
    yamaMainDark: "/mascots/yama_main_dark_v1.webp",
  },
  icons: {
    appLight: "/icons/icon_app_light_v1.webp",
    appDark: "/icons/icon_app_dark_v1.webp",
  },
} as const;

export function getMascotPath(theme: "light" | "dark" | string | undefined) {
  return theme === "light"
    ? ASSET_REGISTRY.mascots.yamaMainLight
    : ASSET_REGISTRY.mascots.yamaMainDark;
}
