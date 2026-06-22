import { normalizeRegionSlug } from "@/lib/design-system/worlds";

/** CMS trial slugs → learner display names (JWorld spec). */
export const N5_TRIAL_DISPLAY_BY_LEGACY_TITLE: Readonly<Record<string, string>> = {
  "Foothills Guardian": "Script Keeper",
  "Forest Spirit Challenge": "Kana Warden",
  "Forest Spirit": "Kana Warden",
  "N5 Proving Ground": "Trail Warden",
  "N5 Sentinel Trial": "N5 Sentinel",
  "N5 Sentinel": "N5 Sentinel",
  "Final N5 Trial": "Guardian of First Light",
  "Summit Arbiter": "Guardian of First Light",
  "Script Keeper": "Script Keeper",
  "Kana Warden": "Kana Warden",
  "Trail Warden": "Trail Warden",
  "Guardian of First Light": "Guardian of First Light",
};

export function resolveN5TrialDisplayTitle(
  lessonTitle: string,
  regionSlug: string,
): string {
  if (normalizeRegionSlug(regionSlug) !== "n5") {
    return lessonTitle;
  }
  return N5_TRIAL_DISPLAY_BY_LEGACY_TITLE[lessonTitle] ?? lessonTitle;
}
