export const CONTENT_STATUSES = [
  "draft",
  "review",
  "approved",
  "published",
  "archived",
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const JLPT_LEVELS = ["n5", "n4", "n3", "n2", "n1"] as const;

export type JlptLevel = (typeof JLPT_LEVELS)[number];

export const ACHIEVEMENT_RARITIES = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
] as const;

export type AchievementRarity = (typeof ACHIEVEMENT_RARITIES)[number];

export const ADMIN_ROLES = [
  "learner",
  "viewer",
  "moderator",
  "content_manager",
  "asset_manager",
  "curriculum_manager",
  "analytics_manager",
  "administrator",
  "super_administrator",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const CONTENT_ADMIN_ROLES: AdminRole[] = [
  "content_manager",
  "curriculum_manager",
  "administrator",
  "super_administrator",
];

export function isContentAdminRole(role: string): role is AdminRole {
  return CONTENT_ADMIN_ROLES.includes(role as AdminRole);
}

export function isContentStatus(value: string): value is ContentStatus {
  return CONTENT_STATUSES.includes(value as ContentStatus);
}

export function isJlptLevel(value: string): value is JlptLevel {
  return JLPT_LEVELS.includes(value as JlptLevel);
}

export function isAchievementRarity(value: string): value is AchievementRarity {
  return ACHIEVEMENT_RARITIES.includes(value as AchievementRarity);
}
