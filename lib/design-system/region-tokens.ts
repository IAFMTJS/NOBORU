import type { RegionSlug } from "@/lib/design-system/regions";

export type { RegionSlug } from "@/lib/design-system/regions";

export type RegionVisualTokens = {
  slug: RegionSlug;
  label: string;
  gradient: string;
  border: string;
  badge: string;
  ring: string;
};

export const REGION_VISUALS: Record<string, RegionVisualTokens> = {
  foothills: {
    slug: "foothills",
    label: "Foothills",
    gradient: "from-trail-glow/20 via-primary/5 to-card",
    border: "border-trail-glow/30",
    badge: "bg-trail-glow/15 text-heading-story",
    ring: "ring-trail-glow/25",
  },
  "forest-trail": {
    slug: "forest-trail",
    label: "Forest Trail",
    gradient: "from-success/20 via-primary/5 to-card",
    border: "border-success/30",
    badge: "bg-success/15 text-success",
    ring: "ring-success/25",
  },
  "mount-n5": {
    slug: "mount-n5",
    label: "Mount N5",
    gradient: "from-info/20 via-primary/5 to-card",
    border: "border-info/30",
    badge: "bg-info/15 text-info",
    ring: "ring-info/30",
  },
  "mount-n4": {
    slug: "mount-n4",
    label: "Mount N4",
    gradient: "from-reward/20 via-primary/5 to-card",
    border: "border-reward/30",
    badge: "bg-reward/15 text-reward",
    ring: "ring-reward/25",
  },
  "mount-n3": {
    slug: "mount-n3",
    label: "Mount N3",
    gradient: "from-reward/25 via-primary/5 to-card",
    border: "border-reward/35",
    badge: "bg-reward/15 text-reward",
    ring: "ring-reward/25",
  },
  "mount-n2": {
    slug: "mount-n2",
    label: "Mount N2",
    gradient: "from-muted-foreground/20 via-primary/5 to-card",
    border: "border-border/40",
    badge: "bg-muted text-muted-foreground",
    ring: "ring-border/25",
  },
  "mount-n1": {
    slug: "mount-n1",
    label: "Mount N1",
    gradient: "from-info/30 via-primary/5 to-card",
    border: "border-info/35",
    badge: "bg-info/20 text-info",
    ring: "ring-info/25",
  },
  "master-summit": {
    slug: "master-summit",
    label: "Master Summit",
    gradient: "from-xp-gold/25 via-primary/10 to-card",
    border: "border-xp-gold/35",
    badge: "bg-xp-gold/15 text-xp-gold",
    ring: "ring-xp-gold/30",
  },
};

const DEFAULT_REGION = REGION_VISUALS.foothills;

export function getRegionVisuals(slug: string): RegionVisualTokens {
  return REGION_VISUALS[slug] ?? DEFAULT_REGION;
}
