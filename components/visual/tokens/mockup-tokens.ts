/**
 * Shared measurable tokens from canonical mockups.
 * Single source for journey, camp, bag, loading, and nav visual parity.
 */

export const VISUAL_MOCKUP = {
  hud: {
    heightPx: 52,
    topInsetRem: 0.75,
    horizontalInsetRem: 0.75,
  },
  node: {
    sizeSmPx: 40,
    sizeMdPx: 52,
    sizeLgPx: 68,
    sizeLockedPx: 44,
    currentScale: 1.12,
    selectedScale: 1.08,
  },
  scrollRail: {
    widthPx: 4,
    dotSizePx: 6,
    rightInsetRem: 0.5,
  },
  glass: {
    borderClass: "border-white/12",
    bgClass: "bg-black/45 backdrop-blur-md",
    panelClass:
      "rounded-2xl border border-amber-900/35 bg-gradient-to-b from-amber-950/35 to-black/45 backdrop-blur-md",
    pouchClass:
      "rounded-2xl border border-amber-900/35 bg-gradient-to-b from-stone-900/80 to-black/70 backdrop-blur-md",
    sheetClass:
      "rounded-t-2xl border border-amber-900/40 bg-gradient-to-b from-stone-900/95 to-black/95 backdrop-blur-md",
  },
  glow: {
    currentRing: "ring-2 ring-trail-glow/55 ring-offset-2 ring-offset-transparent",
    warmHalo: "trail-glow-warm shadow-[0_0_20px_hsl(var(--trail-glow)/0.35)]",
    activeNav: "shadow-nav-active",
  },
  typography: {
    minCaption: "text-caption",
    navLabel: "text-caption font-semibold tracking-wide",
  },
} as const;

/** @deprecated Use VISUAL_MOCKUP — kept for gradual import migration */
export const JOURNEY_MOCKUP = VISUAL_MOCKUP;

/** Derive display gem count from total XP (matches camp pseudo-gem pattern). */
export function resolveDisplayGemCount(totalXp: number): number {
  return Math.max(0, Math.round(totalXp / 120));
}
