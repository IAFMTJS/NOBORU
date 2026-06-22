import type { RegionSlug } from "@/lib/design-system/regions";
import { normalizeRegionSlug } from "@/lib/design-system/worlds";

export type { RegionSlug } from "@/lib/design-system/regions";

export type RegionVisualTokens = {
  slug: RegionSlug;
  label: string;
  gradient: string;
  border: string;
  badge: string;
  ring: string;
};

export const REGION_VISUALS: Record<RegionSlug, RegionVisualTokens> = {
  n5: {
    slug: "n5",
    label: "Realm of First Light",
    gradient: "from-trail-glow/20 via-primary/5 to-card",
    border: "border-trail-glow/30",
    badge: "bg-trail-glow/15 text-heading-story",
    ring: "ring-trail-glow/25",
  },
  n4: {
    slug: "n4",
    label: "Realm of the Green Ascent",
    gradient: "from-success/20 via-primary/5 to-card",
    border: "border-success/30",
    badge: "bg-success/15 text-success",
    ring: "ring-success/25",
  },
  n3: {
    slug: "n3",
    label: "Realm of the Cloudline",
    gradient: "from-reward/25 via-primary/5 to-card",
    border: "border-reward/35",
    badge: "bg-reward/15 text-reward",
    ring: "ring-reward/25",
  },
  n2: {
    slug: "n2",
    label: "Realm of the Sky Temple",
    gradient: "from-muted-foreground/20 via-primary/5 to-card",
    border: "border-border/40",
    badge: "bg-muted text-muted-foreground",
    ring: "ring-border/25",
  },
  n1: {
    slug: "n1",
    label: "Realm of the Celestial Summit",
    gradient: "from-info/30 via-primary/5 to-card",
    border: "border-info/35",
    badge: "bg-info/20 text-info",
    ring: "ring-info/25",
  },
};

const DEFAULT_REGION = REGION_VISUALS.n5;

export function getRegionVisuals(slug: string): RegionVisualTokens {
  const world = normalizeRegionSlug(slug);
  return REGION_VISUALS[world] ?? DEFAULT_REGION;
}
