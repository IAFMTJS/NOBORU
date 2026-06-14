import chainsConfig from "@/lib/assets/asset-version-chains.json";

export const ASSET_VERSION_CHAINS = chainsConfig.chains;

export type AssetVersionKey = keyof typeof ASSET_VERSION_CHAINS;

export const TRAIL_SCROLL_VERSION_ORDER = chainsConfig.trailScrollVersionOrder;

export function buildTrailScrollVersionChain(
  regionSlug: string,
  theme: "light" | "dark",
): string[] {
  return TRAIL_SCROLL_VERSION_ORDER.map(
    (version) => `/ui/ui_trail_scroll_${regionSlug}_${theme}_${version}.webp`,
  );
}
