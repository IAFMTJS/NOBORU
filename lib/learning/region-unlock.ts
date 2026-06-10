export type RegionAvailability = "available" | "locked";

export type RegionAccessViewModel = {
  availability: RegionAvailability;
  lockReason: string | null;
};

export const REGION_PREREQUISITE_TRIAL_SLUGS: Record<string, string> = {
  "mount-n4": "n5-final-trial",
};

export const PREREQUISITE_TRIAL_LABELS: Record<string, string> = {
  "n5-final-trial": "Final N5 Trial",
};

export function resolveRegionAccess(
  regionSlug: string,
  passedTrialSlugs: ReadonlySet<string>,
): RegionAccessViewModel {
  const prerequisiteSlug = REGION_PREREQUISITE_TRIAL_SLUGS[regionSlug];

  if (!prerequisiteSlug) {
    return { availability: "available", lockReason: null };
  }

  if (passedTrialSlugs.has(prerequisiteSlug)) {
    return { availability: "available", lockReason: null };
  }

  const trialLabel =
    PREREQUISITE_TRIAL_LABELS[prerequisiteSlug] ?? prerequisiteSlug;

  return {
    availability: "locked",
    lockReason: `Complete ${trialLabel} to unlock this region.`,
  };
}
