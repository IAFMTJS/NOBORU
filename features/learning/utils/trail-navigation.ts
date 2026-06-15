/** Deep link to a region gate on the continuous Journey scroll (`/learn`). */
export function regionTrailHref(regionSlug: string): string {
  return `/learn?region=${encodeURIComponent(regionSlug)}`;
}

/** Deep link to a specific trail node after lesson complete/fail. */
export function journeyNodeHref(nodeId: string): string {
  return `/learn?node=${encodeURIComponent(nodeId)}`;
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
  return `/learn?${params.toString()}`;
}
