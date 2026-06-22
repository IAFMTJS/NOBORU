import type { RegionSlug } from "@/lib/design-system/regions";
import type { ArtAssetRef } from "@/lib/assets/art-mappings";
import { normalizeRegionSlug } from "@/lib/design-system/worlds";

/**
 * Journey narrative bands — one per JLPT world (JWorld five-world model).
 */
export type NarrativeArcId = "n5" | "n4" | "n3" | "n2" | "n1";

export type NarrativeArc = {
  id: NarrativeArcId;
  name: string;
  description: string;
  gateIcon: ArtAssetRef;
  fogLevel: "low" | "heavy" | "sacred" | "none";
};

export const NARRATIVE_ARCS: Record<NarrativeArcId, NarrativeArc> = {
  n5: {
    id: "n5",
    name: "Realm of First Light",
    description: "Warm dawn, script sanctum, and the first true climb.",
    gateIcon: { category: "ui/icons/nodes", id: "icon-node-region-foot-hills" },
    fogLevel: "low",
  },
  n4: {
    id: "n4",
    name: "Realm of the Green Ascent",
    description: "Bamboo valleys and deeper forest paths.",
    gateIcon: { category: "ui/icons/nodes", id: "icon-node-region-forest" },
    fogLevel: "heavy",
  },
  n3: {
    id: "n3",
    name: "Realm of the Cloudline",
    description: "Stone ridges above the cloud sea.",
    gateIcon: { category: "ui/icons/nodes", id: "icon-node-region-temple-peak" },
    fogLevel: "sacred",
  },
  n2: {
    id: "n2",
    name: "Realm of the Sky Temple",
    description: "Pagodas and wind above the veil.",
    gateIcon: { category: "ui/icons/nodes", id: "icon-node-region-temple-peak" },
    fogLevel: "sacred",
  },
  n1: {
    id: "n1",
    name: "Realm of the Celestial Summit",
    description: "The highest and most prestigious climb.",
    gateIcon: { category: "ui/icons/nodes", id: "icon-node-region-summit" },
    fogLevel: "none",
  },
};

/** World slug maps to itself for narrative purposes. */
export const REGION_NARRATIVE_ARC: Record<RegionSlug, NarrativeArcId> = {
  n5: "n5",
  n4: "n4",
  n3: "n3",
  n2: "n2",
  n1: "n1",
};

export const NARRATIVE_ARC_ENTRY_REGION: Record<NarrativeArcId, RegionSlug> = {
  n5: "n5",
  n4: "n4",
  n3: "n3",
  n2: "n2",
  n1: "n1",
};

export function getNarrativeArcForRegion(slug: string): NarrativeArc {
  const world = normalizeRegionSlug(slug);
  return NARRATIVE_ARCS[world];
}

export function isNarrativeArcEntryRegion(slug: string): boolean {
  const world = normalizeRegionSlug(slug);
  return NARRATIVE_ARC_ENTRY_REGION[world] === world;
}

export function getNarrativeArcWeatherZone(
  arcId: NarrativeArcId,
): "base" | "mid" | "upper" | "summit" {
  switch (arcId) {
    case "n5":
      return "base";
    case "n4":
      return "mid";
    case "n3":
      return "mid";
    case "n2":
      return "upper";
    case "n1":
      return "summit";
    default:
      return "mid";
  }
}
