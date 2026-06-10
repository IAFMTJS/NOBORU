export const MAX_ELEVATION_LEVEL = 100;

export const REVIEW_EP = {
  again: 0,
  good: 3,
  strong: 5,
} as const;

export const COMPREHENSION_EP = 15;

export type ElevationSourceType =
  | "lesson_complete"
  | "review_rating"
  | "reading_complete"
  | "listening_complete"
  | "achievement"
  | "quest"
  | "game";

/** EP required to advance from `level` to `level + 1`. */
export function epRequiredForNextLevel(level: number): number {
  if (level >= MAX_ELEVATION_LEVEL) return 0;
  return 100 + (level - 1) * 25;
}

export function calculateLevelFromTotalEp(totalEp: number): {
  level: number;
  currentEp: number;
} {
  let level = 1;
  let remaining = totalEp;

  while (level < MAX_ELEVATION_LEVEL) {
    const needed = epRequiredForNextLevel(level);
    if (remaining < needed) break;
    remaining -= needed;
    level += 1;
  }

  return { level, currentEp: remaining };
}

export function levelProgressPercent(level: number, currentEp: number): number {
  const needed = epRequiredForNextLevel(level);
  if (needed === 0) return 100;
  return Math.min(100, Math.round((currentEp / needed) * 100));
}
