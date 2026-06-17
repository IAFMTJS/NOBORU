/**
 * Canonical region slug catalog — shared by asset registry, visual tokens, and world-tree zones.
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

const REGION_SLUG_SET = new Set<string>(REGION_SLUGS);

export function isRegionSlug(slug: string): slug is RegionSlug {
  return REGION_SLUG_SET.has(slug);
}
