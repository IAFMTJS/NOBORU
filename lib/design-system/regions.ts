/**
 * Canonical region slug catalog — five JLPT worlds (JWorld Option A).
 * @see docs/JWorld/09-cms-decision.md
 */
import {
  LEGACY_REGION_TO_WORLD,
  WORLD_SLUGS,
  type WorldSlug,
  normalizeRegionSlug,
} from "@/lib/design-system/worlds";

export const REGION_SLUGS = WORLD_SLUGS;

export type RegionSlug = WorldSlug;

export { LEGACY_REGION_TO_WORLD, normalizeRegionSlug };

const KNOWN_REGION_SLUGS = new Set<string>([
  ...REGION_SLUGS,
  ...Object.keys(LEGACY_REGION_TO_WORLD),
]);

export function isKnownRegionSlug(slug: string): boolean {
  return KNOWN_REGION_SLUGS.has(slug);
}

export function isRegionSlug(slug: string): slug is RegionSlug {
  return (REGION_SLUGS as readonly string[]).includes(slug);
}
