import { normalizeRegionSlug } from "@/lib/design-system/worlds";

export type RegionAvailability = "available" | "locked";

export type RegionAccessViewModel = {
  availability: RegionAvailability;
  lockReason: string | null;
};

export const REGION_PREREQUISITE_TRIAL_SLUGS: Record<string, string> = {
  n4: "n5-final-trial",
  n3: "n4-final-trial",
  n2: "n3-final-trial",
  n1: "n2-final-trial",
};

export const PREREQUISITE_TRIAL_LABELS: Record<string, string> = {
  "n5-final-trial": "Final N5 Trial",
  "n4-final-trial": "Final N4 Trial",
  "n3-final-trial": "Final N3 Trial",
  "n2-final-trial": "Final N2 Trial",
  "n1-final-trial": "Final N1 Trial",
};

export function resolveRegionAccess(
  regionSlug: string,
  passedTrialSlugs: ReadonlySet<string>,
): RegionAccessViewModel {
  const worldSlug = normalizeRegionSlug(regionSlug);
  const prerequisiteSlug = REGION_PREREQUISITE_TRIAL_SLUGS[worldSlug];

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
    lockReason: `Complete ${trialLabel} to unlock this realm.`,
  };
}
