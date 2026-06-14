/** Vertical progression bands within a regional path (pathPosition 0 = base, 1 = summit). */
export type JourneyEnvironmentZone =
  | "base"
  | "mid"
  | "upper"
  | "summit";

export type JourneyEnvironmentBand = {
  zone: JourneyEnvironmentZone;
  label: string;
  /** Normalized pathPosition range [min, max] along the regional spine. */
  pathRange: readonly [number, number];
  /** Tailwind gradient overlay applied to the section band. */
  overlayClass: string;
  /** Percentage height of the region section this band occupies (bottom-up). */
  heightPercent: number;
};

export const JOURNEY_ENVIRONMENT_BANDS: readonly JourneyEnvironmentBand[] = [
  {
    zone: "base",
    label: "Lower Trail",
    pathRange: [0, 0.28],
    overlayClass: "from-emerald-950/35 via-emerald-900/10 to-transparent",
    heightPercent: 28,
  },
  {
    zone: "mid",
    label: "Mid Mountain",
    pathRange: [0.28, 0.58],
    overlayClass: "from-stone-900/30 via-amber-950/10 to-transparent",
    heightPercent: 30,
  },
  {
    zone: "upper",
    label: "Upper Trail",
    pathRange: [0.58, 0.84],
    overlayClass: "from-indigo-950/35 via-slate-900/15 to-transparent",
    heightPercent: 26,
  },
  {
    zone: "summit",
    label: "Summit Approach",
    pathRange: [0.84, 1],
    overlayClass: "from-sky-950/40 via-blue-950/20 to-transparent",
    heightPercent: 16,
  },
] as const;

export function resolveJourneyEnvironmentZone(
  pathPosition: number,
): JourneyEnvironmentZone {
  const t = Math.min(1, Math.max(0, pathPosition));
  const band = JOURNEY_ENVIRONMENT_BANDS.find(
    (entry) => t >= entry.pathRange[0] && t <= entry.pathRange[1],
  );
  return band?.zone ?? "mid";
}
