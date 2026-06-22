/** Realm of First Light — N5 world display + scroll constants. @see docs/JWorld/11-n5-complete-spec.md */

export const N5_WORLD_SLUG = "n5" as const;

export const N5_WORLD_TITLE = "Realm of First Light";

export const N5_WORLD_SUBTITLE = "N5 · 始まりの境";

/** Target vertical gap between adjacent visible nodes (~28vh ≈ generous touch spacing). */
export const N5_TARGET_NODE_GAP_VH = 28;

/** Floor scroll height when the path is short. */
export const N5_SCROLL_MIN_HEIGHT_VH_BASE = 800;

/** @deprecated Use resolveN5ScrollMinHeightVh(nodeCount) — kept for audits as minimum floor. */
export const N5_SCROLL_MIN_HEIGHT_VH = N5_SCROLL_MIN_HEIGHT_VH_BASE;

/** Path range used when spreading visible nodes along the N5 spine. */
export const N5_NODE_PATH_START = 0.02;
export const N5_NODE_PATH_END = 0.98;

export const N5_PATH_USABLE_FRACTION = N5_NODE_PATH_END - N5_NODE_PATH_START;

/** Approximate y% span from journey start to summit on the N5 spine. */
export const N5_SPINE_Y_SPAN_PERCENT = 87;

/** Scales canvas height so each visible node has N5_TARGET_NODE_GAP_VH between neighbors. */
export function resolveN5ScrollMinHeightVh(visibleNodeCount: number): number {
  if (visibleNodeCount <= 1) {
    return N5_SCROLL_MIN_HEIGHT_VH_BASE;
  }
  const gapCount = visibleNodeCount - 1;
  const required = Math.ceil(
    (gapCount * N5_TARGET_NODE_GAP_VH * 100) / N5_SPINE_Y_SPAN_PERCENT,
  );
  return Math.max(N5_SCROLL_MIN_HEIGHT_VH_BASE, required);
}

export const N5_ACT_BANDS = [
  { actIndex: 1 as const, pathStart: 0, pathEnd: 0.28, yStart: 71, yEnd: 96 },
  { actIndex: 2 as const, pathStart: 0.28, pathEnd: 0.63, yStart: 36, yEnd: 73 },
  { actIndex: 3 as const, pathStart: 0.63, pathEnd: 1, yStart: 4, yEnd: 38 },
] as const;

/** object-position per act — path corridor stays centered on the spine. */
export const N5_ACT_SLICE_OBJECT_POSITION: Record<1 | 2 | 3, string> = {
  1: "object-[center_88%]",
  2: "object-center",
  3: "object-[center_14%]",
};

export const N5_ACT_BACKDROP_GRADIENTS: Record<1 | 2 | 3, string> = {
  1: "from-black/25 via-transparent to-black/15",
  2: "from-black/15 via-transparent to-black/15",
  3: "from-black/10 via-transparent to-black/20",
};
