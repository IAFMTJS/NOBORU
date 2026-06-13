/** Maximum lessons placed on a single trail path / scroll art canvas. */
export const MAX_LESSONS_PER_TRAIL_PATH = 40;

/** Overlap between stacked scroll segments so the mountain feels continuous (0–1). */
export const TRAIL_SEGMENT_OVERLAP_RATIO = 0.12;

/** Seam gradient height — keep aligned with overlap so joins do not double-darken. */
export const TRAIL_SEGMENT_SCRIM_RATIO = TRAIL_SEGMENT_OVERLAP_RATIO;
