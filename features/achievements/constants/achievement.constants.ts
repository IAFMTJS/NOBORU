import type { AchievementRarity } from "@/lib/content/types";

export const ACHIEVEMENT_SLUGS = {
  firstStep: "first-step",
  firstLesson: "first-lesson",
  tenLessons: "ten-lessons",
  hundredWords: "hundred-words",
  fiftyKanji: "fifty-kanji",
  sevenDayStreak: "seven-day-streak",
  n5Completed: "n5-completed",
  memoryMaster: "memory-master",
  gameChampion: "game-champion",
  perfectRecall: "perfect-recall",
  dungeonDelver: "dungeon-delver",
} as const;

export type AchievementSlug =
  (typeof ACHIEVEMENT_SLUGS)[keyof typeof ACHIEVEMENT_SLUGS];

/** Default EP when `reward_value` is not set on the achievement row. */
export const ACHIEVEMENT_EP_BY_RARITY: Record<AchievementRarity, number> = {
  common: 25,
  uncommon: 50,
  rare: 100,
  epic: 200,
  legendary: 350,
  mythic: 500,
};

export const ACHIEVEMENT_RARITY_LABELS: Record<AchievementRarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
  mythic: "Mythic",
};

export const N5_REGION_SLUG = "n5";

/** @deprecated Use N5_REGION_SLUG */
export const MOUNT_N5_REGION_SLUG = N5_REGION_SLUG;

export const RECENT_ACHIEVEMENTS_LIMIT = 3;
