/** Measurable tokens from journey-mockup-contract.md */

export const JOURNEY_MOCKUP = {
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
  },
  glow: {
    currentRing: "ring-2 ring-trail-glow/55 ring-offset-2 ring-offset-transparent",
    warmHalo: "trail-glow-warm shadow-[0_0_20px_hsl(var(--trail-glow)/0.35)]",
  },
} as const;

/** Derive display gem count from total XP (matches camp pseudo-gem pattern). */
export function resolveDisplayGemCount(totalXp: number): number {
  return Math.max(0, Math.round(totalXp / 120));
}
