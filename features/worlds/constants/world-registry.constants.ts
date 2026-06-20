import { N1_WORLD } from "@/features/worlds/worlds/n1/n1-world.constants";
import { N2_WORLD } from "@/features/worlds/worlds/n2/n2-world.constants";
import { N3_WORLD } from "@/features/worlds/worlds/n3/n3-world.constants";
import { N4_WORLD } from "@/features/worlds/worlds/n4/n4-world.constants";
import { N5_WORLD } from "@/features/worlds/worlds/n5/n5-world.constants";
import type { JlptWorldDefinition } from "@/features/worlds/types/world.types";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/content/types";

/**
 * Ordered registry of all JLPT worlds — bottom (N5) to top (N1).
 * Add new worlds here only; existing world modules stay untouched.
 */
export const JLPT_WORLD_REGISTRY: readonly JlptWorldDefinition[] = [
  N5_WORLD,
  N4_WORLD,
  N3_WORLD,
  N2_WORLD,
  N1_WORLD,
] as const;

const WORLD_BY_ID = new Map<JlptLevel, JlptWorldDefinition>(
  JLPT_WORLD_REGISTRY.map((world) => [world.id, world]),
);

export function getJlptWorldDefinition(jlptLevel: JlptLevel): JlptWorldDefinition {
  const world = WORLD_BY_ID.get(jlptLevel);
  if (!world) {
    throw new Error(`Unknown JLPT world: ${jlptLevel}`);
  }
  return world;
}

export function isRegisteredJlptWorld(value: string): value is JlptLevel {
  return JLPT_LEVELS.includes(value as JlptLevel) && WORLD_BY_ID.has(value as JlptLevel);
}

export function getWorldHref(jlptLevel: JlptLevel): string {
  return `/worlds/${jlptLevel}`;
}

export function getNextWorld(jlptLevel: JlptLevel): JlptWorldDefinition | null {
  const world = getJlptWorldDefinition(jlptLevel);
  return world.nextWorldId ? getJlptWorldDefinition(world.nextWorldId) : null;
}

export function resolveWorldForRegionSlug(
  regionSlug: string,
): JlptWorldDefinition | null {
  return (
    JLPT_WORLD_REGISTRY.find((world) =>
      (world.regionSlugs as readonly string[]).includes(regionSlug),
    ) ?? null
  );
}
