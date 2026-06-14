import manifest from "@/lib/assets/asset-version-manifest.json";
import type { AssetVersionKey } from "@/lib/assets/asset-version-chains";

export function getResolvedAsset(key: AssetVersionKey): string {
  return manifest.resolved[key];
}

export function getResolvedTrailScrollPath(
  regionSlug: string,
  theme: "light" | "dark",
): string | undefined {
  const key = `trailScroll.${regionSlug}.${theme}`;
  const map = manifest.trailScrollResolved as Record<string, string>;
  return map[key];
}

export function getAssetVersionManifestMeta() {
  return {
    generatedAt: manifest.generatedAt,
    fallbacksUsed: manifest.fallbacksUsed,
    missing: manifest.missing,
  };
}
