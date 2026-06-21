/** Primary World Tree entry — bottom nav Tree tab. */
export const TREE_TRAIL_ENTRY_HREF = "/tree";

/** Deep link to a region gate on the World Tree scroll. */
export function regionTrailHref(regionSlug: string): string {
  return `/tree?region=${encodeURIComponent(regionSlug)}`;
}

/** Deep link to a specific trail node after lesson complete/fail. */
export function journeyNodeHref(nodeId: string): string {
  return `/tree?node=${encodeURIComponent(nodeId)}`;
}

type LessonJourneyReturnInput = {
  lessonId: string;
  trailNodeId?: string | null;
  regionSlug: string;
  unlocksRegionSlug?: string | null;
};

/** Post-lesson return — scrolls to the completed node; optional unlock ceremony. */
export function lessonReturnJourneyHref(
  session: LessonJourneyReturnInput,
  options?: { regionUnlocked?: boolean },
): string {
  const params = new URLSearchParams();
  params.set("node", session.trailNodeId ?? session.lessonId);
  if (options?.regionUnlocked && session.unlocksRegionSlug) {
    params.set("unlock", session.unlocksRegionSlug);
  }
  return `/tree?${params.toString()}`;
}
