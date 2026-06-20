import type { RegionSlug } from "@/lib/design-system/regions";

/** When true, Journey renders skeleton scaffold instead of sheet-remaster art. */
export const JOURNEY_SKELETON_MODE = true;

/** When true, stack JLPT hero band art (transparent PNG) on the World Tree canvas. */
export const JOURNEY_JLPT_BAND_ART = true;

/** Insert a landmark destination every N lesson nodes along a regional path. */
export const LANDMARK_EVERY_N_LESSONS = 5;

/** Minimum scroll height tier for the journey map — world must exceed one screen. */
export type JourneyRegionScale = "small" | "medium" | "large" | "major";

export const JOURNEY_REGION_SCALE_MIN_HEIGHT_VH: Record<
  JourneyRegionScale,
  number
> = {
  small: 200,
  medium: 400,
  large: 800,
  major: 1000,
} as const;

/** Per-region scale so every trail feels like a climb, not a menu screen. */
export const JOURNEY_REGION_SCALES: Record<RegionSlug, JourneyRegionScale> = {
  foothills: "medium",
  "forest-trail": "medium",
  "mount-n5": "large",
  "mount-n4": "large",
  "mount-n3": "large",
  "mount-n2": "major",
  "mount-n1": "major",
  "master-summit": "major",
} as const;

export function resolveRegionScrollMinHeightVh(regionSlug: string): number {
  const scale =
    JOURNEY_REGION_SCALES[regionSlug as RegionSlug] ?? ("medium" as const);
  return JOURNEY_REGION_SCALE_MIN_HEIGHT_VH[scale];
}

export type JourneyLandmarkKind =
  | "village"
  | "shrine"
  | "torii"
  | "bridge"
  | "overlook"
  | "camp";

export type JourneyLandmarkDefinition = {
  label: string;
  subtitle: string;
  kind: JourneyLandmarkKind;
};

/** Default landmarks cycled along the path when no CMS landmark exists yet. */
export const JOURNEY_LANDMARKS: readonly JourneyLandmarkDefinition[] = [
  { label: "Start Village", subtitle: "Journey begins", kind: "village" },
  { label: "Torii Gate", subtitle: "Sacred threshold", kind: "torii" },
  { label: "Scenic Overlook", subtitle: "Viewpoint", kind: "overlook" },
  { label: "Shrine Rest", subtitle: "Checkpoint shrine", kind: "shrine" },
  { label: "Mountain Bridge", subtitle: "Crossing ahead", kind: "bridge" },
  { label: "Trail Camp", subtitle: "Rest stop", kind: "camp" },
] as const;

/** @deprecated Use JOURNEY_LANDMARKS */
export const JOURNEY_LANDMARK_LABELS = JOURNEY_LANDMARKS.map(
  (landmark) => landmark.label,
);