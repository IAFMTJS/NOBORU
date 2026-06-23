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

/** Scroll-pan ranges per act slice (journey start → act exit). */
export const N5_ACT_BACKDROP_PAN: Record<
  1 | 2 | 3,
  {
    yStart: number;
    yEnd: number;
    xStart: number;
    xEnd: number;
    scaleStart: number;
    scaleEnd: number;
    scaleWave: number;
  }
> = {
  1: { yStart: 92, yEnd: 24, xStart: 49, xEnd: 51, scaleStart: 1.1, scaleEnd: 1.18, scaleWave: 0.02 },
  2: { yStart: 86, yEnd: 18, xStart: 47, xEnd: 53, scaleStart: 1.08, scaleEnd: 1.16, scaleWave: 0.025 },
  3: { yStart: 80, yEnd: 8, xStart: 51, xEnd: 47, scaleStart: 1.1, scaleEnd: 1.2, scaleWave: 0.02 },
};

/** Crossfade + pan windows in canvas y% (94 = journey start, 6 = summit). */
export const N5_ACT_BLEND_ZONES = [
  {
    actIndex: 1 as const,
    panStart: 96,
    panEnd: 70,
    fadeOutAbove: { start: 62, end: 72 },
  },
  {
    actIndex: 2 as const,
    panStart: 72,
    panEnd: 36,
    fadeInBelow: { start: 62, end: 72 },
    fadeOutAbove: { start: 30, end: 40 },
  },
  {
    actIndex: 3 as const,
    panStart: 40,
    panEnd: 4,
    fadeInBelow: { start: 30, end: 40 },
  },
] as const;

export const N5_ACT_BACKDROP_GRADIENTS: Record<1 | 2 | 3, string> = {
  1: "from-black/25 via-transparent to-black/15",
  2: "from-black/15 via-transparent to-black/15",
  3: "from-black/10 via-transparent to-black/20",
};

/** Act-aware sensory tint overlays (JWorld § Sensory defaults). */
export const N5_ACT_SENSORY_OVERLAY: Record<1 | 2 | 3, string> = {
  1: "from-sky-300/12 via-emerald-900/5 to-transparent",
  2: "from-amber-200/8 via-transparent to-transparent",
  3: "from-orange-100/6 via-transparent to-slate-900/12",
};
