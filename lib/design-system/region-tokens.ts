export type RegionSlug =
  | "foothills"
  | "forest-trail"
  | "mount-n5"
  | "mount-n4"
  | "mount-n3"
  | "mount-n2"
  | "mount-n1"
  | "master-summit";

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
    gradient: "from-amber-500/20 via-primary/5 to-card",
    border: "border-amber-500/30",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-200",
    ring: "ring-amber-500/25",
  },
  "forest-trail": {
    slug: "forest-trail",
    label: "Forest Trail",
    gradient: "from-emerald-600/20 via-primary/5 to-card",
    border: "border-emerald-600/30",
    badge: "bg-emerald-600/15 text-emerald-800 dark:text-emerald-200",
    ring: "ring-emerald-600/25",
  },
  "mount-n5": {
    slug: "mount-n5",
    label: "Mount N5",
    gradient: "from-sky-600/20 via-primary/5 to-card",
    border: "border-sky-600/30",
    badge: "bg-sky-600/15 text-sky-800 dark:text-sky-200",
    ring: "ring-sky-600/30",
  },
  "mount-n4": {
    slug: "mount-n4",
    label: "Mount N4",
    gradient: "from-violet-600/20 via-primary/5 to-card",
    border: "border-violet-600/30",
    badge: "bg-violet-600/15 text-violet-800 dark:text-violet-200",
    ring: "ring-violet-600/25",
  },
  "mount-n3": {
    slug: "mount-n3",
    label: "Mount N3",
    gradient: "from-indigo-600/20 via-primary/5 to-card",
    border: "border-indigo-600/30",
    badge: "bg-indigo-600/15 text-indigo-800 dark:text-indigo-200",
    ring: "ring-indigo-600/25",
  },
  "mount-n2": {
    slug: "mount-n2",
    label: "Mount N2",
    gradient: "from-slate-500/25 via-primary/5 to-card",
    border: "border-slate-400/30",
    badge: "bg-slate-500/15 text-slate-800 dark:text-slate-200",
    ring: "ring-slate-400/25",
  },
  "mount-n1": {
    slug: "mount-n1",
    label: "Mount N1",
    gradient: "from-blue-900/30 via-primary/5 to-card",
    border: "border-blue-400/30",
    badge: "bg-blue-900/20 text-blue-800 dark:text-blue-200",
    ring: "ring-blue-400/25",
  },
  "master-summit": {
    slug: "master-summit",
    label: "Master Summit",
    gradient: "from-yellow-500/25 via-primary/10 to-card",
    border: "border-yellow-500/35",
    badge: "bg-yellow-500/15 text-yellow-800 dark:text-yellow-100",
    ring: "ring-yellow-500/30",
  },
};

const DEFAULT_REGION = REGION_VISUALS.foothills;

export function getRegionVisuals(slug: string): RegionVisualTokens {
  return REGION_VISUALS[slug] ?? DEFAULT_REGION;
}
