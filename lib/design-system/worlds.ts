import type { JlptLevel } from "@/lib/content/types";

/** Canonical JLPT world slugs — one region row per world (JWorld Option A). */
export const WORLD_SLUGS = ["n5", "n4", "n3", "n2", "n1"] as const;

export type WorldSlug = (typeof WORLD_SLUGS)[number];

export type N5ActIndex = 1 | 2 | 3;

export const N5_ACTS: Record<
  N5ActIndex,
  { label: string; subtitle: string }
> = {
  1: { label: "Act I", subtitle: "Awakening" },
  2: { label: "Act II", subtitle: "First steps" },
  3: { label: "Act III", subtitle: "The climb begins" },
} as const;

/** Maps deprecated CMS region slugs to world slugs (post-migration aliases). */
export const LEGACY_REGION_TO_WORLD: Record<string, WorldSlug> = {
  foothills: "n5",
  "forest-trail": "n5",
  "mount-n5": "n5",
  "mount-n4": "n4",
  "mount-n3": "n3",
  "mount-n2": "n2",
  "mount-n1": "n1",
  "master-summit": "n1",
};

const WORLD_SLUG_SET = new Set<string>(WORLD_SLUGS);

export function isWorldSlug(slug: string): slug is WorldSlug {
  return WORLD_SLUG_SET.has(slug);
}

/** Resolve any region slug (legacy or world) to a canonical world slug. */
export function normalizeRegionSlug(slug: string): WorldSlug {
  if (isWorldSlug(slug)) {
    return slug;
  }
  return LEGACY_REGION_TO_WORLD[slug] ?? "n5";
}

export function worldSlugToJlptLevel(slug: string): JlptLevel {
  const world = normalizeRegionSlug(slug);
  return world;
}

export function getN5ActLabel(actIndex: number | null | undefined): string | null {
  if (actIndex === 1 || actIndex === 2 || actIndex === 3) {
    const act = N5_ACTS[actIndex];
    return `${act.label} · ${act.subtitle}`;
  }
  return null;
}
