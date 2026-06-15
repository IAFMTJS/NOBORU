import type { AchievementUnlockViewModel } from "@/features/achievements/types/achievement.types";
import type { NextUnlockViewModel } from "@/lib/progression/preview.types";

export type ChestKind = "daily" | "weekly" | "boss" | "streak";

export type ChestTemplateRow = {
  id: string;
  slug: string;
  kind: ChestKind;
  title: string;
  description: string | null;
  ep_reward: number;
  bond_xp_reward: number;
  collectible_slug: string | null;
  shrine_protection_grant: number;
  streak_milestone_days: number | null;
};

export type UserChestClaimRow = {
  id: string;
  user_id: string;
  chest_template_id: string;
  claim_period_key: string;
  claimed_at: string;
};

export type ChestRewardViewModel = {
  chestSlug: string;
  title: string;
  epReward: number;
  bondXpReward: number;
  collectibleSlug: string | null;
  shrineProtectionGrant: number;
};

export type ChestEligibilityViewModel = {
  chest: ChestTemplateRow;
  eligible: boolean;
  claimPeriodKey: string;
};

export type ChestClaimResult = ChestRewardViewModel & {
  alreadyClaimed: boolean;
  unlockedAchievements?: AchievementUnlockViewModel[];
};
