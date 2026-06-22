import {
  getWorldHref,
  resolveWorldForRegionSlug,
} from "@/features/worlds/constants/world-registry.constants";

/** Primary World Tree entry — bottom nav Tree tab. */
export const TREE_TRAIL_ENTRY_HREF = "/tree";

function worldTrailHref(
  regionSlug: string,
  params?: Record<string, string>,
): string {
  const world = resolveWorldForRegionSlug(regionSlug);
  const base = world ? getWorldHref(world.id) : TREE_TRAIL_ENTRY_HREF;
  if (!params || Object.keys(params).length === 0) return base;
  const search = new URLSearchParams(params);
  return `${base}?${search.toString()}`;
}

/** Deep link to a region gate on the focused world climb. */
export function regionTrailHref(regionSlug: string): string {
  return worldTrailHref(regionSlug, { region: regionSlug });
}

/** Deep link to a specific trail node after lesson complete/fail. */
export function journeyNodeHref(nodeId: string, regionSlug?: string): string {
  if (regionSlug) {
    return worldTrailHref(regionSlug, { node: nodeId });
  }
  return `${TREE_TRAIL_ENTRY_HREF}?node=${encodeURIComponent(nodeId)}`;
}

type LessonJourneyReturnInput = {
  lessonId: string;
  trailNodeId?: string | null;
  regionSlug: string;
  unlocksRegionSlug?: string | null;
};

/** Post-lesson return — scrolls to the completed node on the focused world climb. */
export function lessonReturnJourneyHref(
  session: LessonJourneyReturnInput,
  options?: { regionUnlocked?: boolean },
): string {
  const params: Record<string, string> = {
    node: session.trailNodeId ?? session.lessonId,
  };
  if (options?.regionUnlocked && session.unlocksRegionSlug) {
    params.unlock = session.unlocksRegionSlug;
  }
  return worldTrailHref(session.regionSlug, params);
}
