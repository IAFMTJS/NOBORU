/**
 * Canonical region slug catalog — shared by asset registry, visual tokens, and trail scroll art.
 */
export const REGION_SLUGS = [
  "foothills",
  "forest-trail",
  "mount-n5",
  "mount-n4",
  "mount-n3",
  "mount-n2",
  "mount-n1",
  "master-summit",
] as const;

export type RegionSlug = (typeof REGION_SLUGS)[number];

/** Regions with dedicated vertical trail scroll art (same set as REGION_SLUGS today). */
export const TRAIL_SCROLL_REGION_SLUGS = REGION_SLUGS;

export type TrailScrollRegionSlug = RegionSlug;

const REGION_SLUG_SET = new Set<string>(REGION_SLUGS);

export function isRegionSlug(slug: string): slug is RegionSlug {
  return REGION_SLUG_SET.has(slug);
}

export function hasTrailScrollArt(slug: string | undefined): boolean {
  return slug ? REGION_SLUG_SET.has(slug) : false;
}
