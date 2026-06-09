import type { AchievementRarity, ContentStatus } from "@/lib/content/types";

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
