/** Insert a landmark destination every N lesson nodes along a regional path. */
export const LANDMARK_EVERY_N_LESSONS = 5;

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
