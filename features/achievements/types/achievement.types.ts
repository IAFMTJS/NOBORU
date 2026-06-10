import type { AchievementRarity, ContentStatus } from "@/lib/content/types";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";

export type AchievementRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rarity: AchievementRarity;
  reward_type: string | null;
  reward_value: number | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type AchievementInput = {
  name: string;
  slug: string;
  description?: string | null;
  rarity?: AchievementRarity;
  rewardType?: string | null;
  rewardValue?: number | null;
  status?: ContentStatus;
};

export type UserAchievementRow = {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  created_at: string;
};

export type UserStreakRow = {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_study_date: string | null;
  created_at: string;
  updated_at: string;
};

export type AchievementViewModel = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  rarity: AchievementRarity;
  unlocked: boolean;
  unlockedAt: string | null;
};

export type AchievementUnlockViewModel = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  rarity: AchievementRarity;
  unlockedAt: string;
  epAwarded: number;
  elevation: ElevationAwardViewModel | null;
};

export type AchievementShowcaseViewModel = {
  unlocked: AchievementViewModel[];
  locked: AchievementViewModel[];
  totalUnlocked: number;
  totalAvailable: number;
};

export type AchievementEvaluationSnapshot = {
  onboardingCompleted: boolean;
  lessonsCompleted: number;
  vocabularyLearned: number;
  kanjiLearned: number;
  currentStreak: number;
  mountN5ProgressPercent: number;
  mountN5LessonCount: number;
};
