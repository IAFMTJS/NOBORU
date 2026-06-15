import type { RegionSlug } from "@/lib/design-system/regions";
import type { ArtAssetRef } from "@/lib/assets/art-mappings";

/**
 * Doc 02 narrative arcs — four major journey chapters.
 *
 * DUAL REGION MODEL (decision documented):
 * - Doc 02 defines 4 narrative arcs (Foot Hills → Forest → Temple Peak → Summit).
 * - The app also uses 8 JLPT mount slugs for progression granularity.
 * - `REGION_NARRATIVE_ARC` maps every JLPT slug to an arc; torii gates render at
 *   `NARRATIVE_ARC_ENTRY_REGION` boundaries. Both models coexist by design.
 *
 * @see docs/route-map.md
 * @see VISUAL MD FILES Document 02 Journey World System
 */
export type NarrativeArcId = "foot-hills" | "forest-trail" | "temple-peak" | "summit";

export type NarrativeArc = {
  id: NarrativeArcId;
  name: string;
  description: string;
  gateIcon: ArtAssetRef;
  fogLevel: "low" | "heavy" | "sacred" | "none";
};

export const NARRATIVE_ARCS: Record<NarrativeArcId, NarrativeArc> = {
  "foot-hills": {
    id: "foot-hills",
    name: "Foot Hills",
    description: "Warm beginner slopes and village lanterns.",
    gateIcon: { category: "ui/icons/nodes", id: "icon-node-region-foot-hills" },
    fogLevel: "low",
  },
  "forest-trail": {
    id: "forest-trail",
    name: "Forest Trail",
    description: "Denser woods and winding paths.",
    gateIcon: { category: "ui/icons/nodes", id: "icon-node-region-forest" },
    fogLevel: "heavy",
  },
  "temple-peak": {
    id: "temple-peak",
    name: "Temple Peak",
    description: "Sacred stairs and temple architecture.",
    gateIcon: { category: "ui/icons/nodes", id: "icon-node-region-temple-peak" },
    fogLevel: "sacred",
  },
  summit: {
    id: "summit",
    name: "The Summit",
    description: "The highest and most prestigious climb.",
    gateIcon: { category: "ui/icons/nodes", id: "icon-node-region-summit" },
    fogLevel: "none",
  },
};

/** JLPT mount regions mapped to narrative arcs (both models coexist). */
export const REGION_NARRATIVE_ARC: Record<RegionSlug, NarrativeArcId> = {
  foothills: "foot-hills",
  "forest-trail": "forest-trail",
  "mount-n5": "foot-hills",
  "mount-n4": "forest-trail",
  "mount-n3": "temple-peak",
  "mount-n2": "temple-peak",
  "mount-n1": "temple-peak",
  "master-summit": "summit",
};

/** First region slug in each arc — major torii gate placement. */
export const NARRATIVE_ARC_ENTRY_REGION: Record<NarrativeArcId, RegionSlug> = {
  "foot-hills": "foothills",
  "forest-trail": "forest-trail",
  "temple-peak": "mount-n3",
  summit: "master-summit",
};

export function getNarrativeArcForRegion(slug: RegionSlug): NarrativeArc {
  return NARRATIVE_ARCS[REGION_NARRATIVE_ARC[slug]];
}

export function isNarrativeArcEntryRegion(slug: RegionSlug): boolean {
  const arcId = REGION_NARRATIVE_ARC[slug];
  return NARRATIVE_ARC_ENTRY_REGION[arcId] === slug;
}

/** Weather band per narrative arc — Doc 02 atmospheric progression. */
export function getNarrativeArcWeatherZone(
  arcId: NarrativeArcId,
): "base" | "mid" | "upper" | "summit" {
  switch (arcId) {
    case "foot-hills":
      return "base";
    case "forest-trail":
      return "mid";
    case "temple-peak":
      return "upper";
    case "summit":
      return "summit";
    default:
      return "mid";
  }
}
