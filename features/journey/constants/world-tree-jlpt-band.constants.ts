import type { JlptLevel } from "@/lib/content/types";
import type { WorldTreeZoneId } from "@/features/journey/constants/world-tree-skeleton.constants";
import type { RegionSlug } from "@/lib/design-system/regions";
import { REGION_SLUG_TO_WORLD_TREE_ZONE } from "@/features/journey/constants/world-tree-skeleton.constants";

/**
 * Five JLPT hero bands for the World Tree — matches reference map layout.
 * Art: transparent PNG puzzle strips (no sky, no UI, no path/nodes baked in).
 *
 * @see Art Library/world-tree/jlpt-bands/
 * @see docs/World tree bible.md
 */
export type WorldTreeJlptBandId = "n5" | "n4" | "n3" | "n2" | "n1";

export type WorldTreeJlptBand = {
  id: WorldTreeJlptBandId;
  jlptLevel: JlptLevel;
  label: string;
  /** Share of full tree height (must sum to 100). */
  heightPercent: number;
  /** Reference map accent — dividers, badges, path glow in UI. */
  accentColor: string;
  accentGlow: string;
  artFileBase: string;
};

/** Bottom → top. y=100 is N5 base, y=0 is N1 crown. */
export const WORLD_TREE_JLPT_BANDS: readonly WorldTreeJlptBand[] = [
  {
    id: "n5",
    jlptLevel: "n5",
    label: "N5 Roots",
    heightPercent: 20,
    accentColor: "#D64045",
    accentGlow: "rgba(214, 64, 69, 0.55)",
    artFileBase: "wt_jlpt_n5",
  },
  {
    id: "n4",
    jlptLevel: "n4",
    label: "N4 Foothills",
    heightPercent: 20,
    accentColor: "#E8A317",
    accentGlow: "rgba(232, 163, 23, 0.55)",
    artFileBase: "wt_jlpt_n4",
  },
  {
    id: "n3",
    jlptLevel: "n3",
    label: "N3 Trunk",
    heightPercent: 20,
    accentColor: "#5EAA5A",
    accentGlow: "rgba(94, 170, 90, 0.55)",
    artFileBase: "wt_jlpt_n3",
  },
  {
    id: "n2",
    jlptLevel: "n2",
    label: "N2 Canopy",
    heightPercent: 20,
    accentColor: "#4A9FD4",
    accentGlow: "rgba(74, 159, 212, 0.55)",
    artFileBase: "wt_jlpt_n2",
  },
  {
    id: "n1",
    jlptLevel: "n1",
    label: "N1 Celestial Crown",
    heightPercent: 20,
    accentColor: "#8B5CF6",
    accentGlow: "rgba(139, 92, 246, 0.55)",
    artFileBase: "wt_jlpt_n1",
  },
] as const;

export const WORLD_TREE_JLPT_BAND_ART_ROOT = "world-tree/jlpt-bands";

export function worldTreeJlptBandArtPath(
  bandId: WorldTreeJlptBandId,
  theme: "light" | "dark",
  version = 1,
): string {
  const band = WORLD_TREE_JLPT_BANDS.find((entry) => entry.id === bandId);
  const base = band?.artFileBase ?? `wt_jlpt_${bandId}`;
  return `${WORLD_TREE_JLPT_BAND_ART_ROOT}/${bandId}/${base}_${theme}_v${version}.png`;
}

export type WorldTreeJlptBandLayout = {
  id: WorldTreeJlptBandId;
  yMin: number;
  yMax: number;
};

/** Cumulative y bands for JLPT hero art (0 = crown, 100 = base). */
export function buildWorldTreeJlptBandLayout(): WorldTreeJlptBandLayout[] {
  let cursor = 100;
  return WORLD_TREE_JLPT_BANDS.map((band) => {
    const yMax = cursor;
    const yMin = cursor - band.heightPercent;
    cursor = yMin;
    return { id: band.id, yMin, yMax };
  });
}

/** Maps internal skeleton zones → five JLPT hero bands. */
export const WORLD_TREE_ZONE_TO_JLPT_BAND: Record<WorldTreeZoneId, WorldTreeJlptBandId> = {
  deep_roots: "n5",
  n5_roots: "n5",
  n4_foothills: "n4",
  n3_trunk_1: "n3",
  n3_trunk_2: "n3",
  n3_trunk_3: "n3",
  n2_canopy: "n2",
  n1_celestial: "n1",
};

const JLPT_BAND_ID_SET = new Set<string>(WORLD_TREE_JLPT_BANDS.map((band) => band.id));

export function isWorldTreeJlptBandId(value: string): value is WorldTreeJlptBandId {
  return JLPT_BAND_ID_SET.has(value);
}

export function resolveJlptBandForZone(zoneId: WorldTreeZoneId): WorldTreeJlptBandId {
  return WORLD_TREE_ZONE_TO_JLPT_BAND[zoneId];
}

export function resolveJlptBandForRegion(regionSlug: string): WorldTreeJlptBandId | null {
  const zoneId = REGION_SLUG_TO_WORLD_TREE_ZONE[regionSlug as RegionSlug];
  return zoneId ? resolveJlptBandForZone(zoneId) : null;
}

export function resolveJlptBandFromY(yPercent: number): WorldTreeJlptBandId {
  const bands = buildWorldTreeJlptBandLayout();
  for (const band of bands) {
    if (yPercent >= band.yMin && yPercent <= band.yMax) return band.id;
  }
  return yPercent < 50 ? "n1" : "n5";
}

export function findJlptBandCenterY(bandId: WorldTreeJlptBandId): number {
  const band = buildWorldTreeJlptBandLayout().find((entry) => entry.id === bandId);
  return band ? (band.yMin + band.yMax) / 2 : 50;
}

export function resolveJlptBandLabel(bandId: WorldTreeJlptBandId): string {
  return WORLD_TREE_JLPT_BANDS.find((band) => band.id === bandId)?.label ?? bandId.toUpperCase();
}

export function resolveJlptBandAccent(bandId: WorldTreeJlptBandId): WorldTreeJlptBand {
  return WORLD_TREE_JLPT_BANDS.find((band) => band.id === bandId) ?? WORLD_TREE_JLPT_BANDS[0]!;
}
