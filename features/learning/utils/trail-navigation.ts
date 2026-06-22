/** Primary journey entry — bottom nav Tree tab. */
export const TREE_TRAIL_ENTRY_HREF = "/tree";

/** Deep link to a region on the journey map (placeholder until new map ships). */
export function regionTrailHref(regionSlug: string): string {
  return `${TREE_TRAIL_ENTRY_HREF}?region=${encodeURIComponent(regionSlug)}`;
}

/** Deep link to a specific trail node after lesson complete/fail. */
export function journeyNodeHref(nodeId: string, regionSlug?: string): string {
  const params = new URLSearchParams({ node: nodeId });
  if (regionSlug) params.set("region", regionSlug);
  return `${TREE_TRAIL_ENTRY_HREF}?${params.toString()}`;
}

type LessonJourneyReturnInput = {
  lessonId: string;
  trailNodeId?: string | null;
  regionSlug: string;
  unlocksRegionSlug?: string | null;
};

/** Post-lesson return — scrolls to the completed node when the new map is available. */
export function lessonReturnJourneyHref(
  session: LessonJourneyReturnInput,
  options?: { regionUnlocked?: boolean },
): string {
  const params = new URLSearchParams({
    node: session.trailNodeId ?? session.lessonId,
    region: session.regionSlug,
  });
  if (options?.regionUnlocked && session.unlocksRegionSlug) {
    params.set("unlock", session.unlocksRegionSlug);
  }
  return `${TREE_TRAIL_ENTRY_HREF}?${params.toString()}`;
}
