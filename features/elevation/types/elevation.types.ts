import type { ContentStatus } from "@/lib/content/types";

export type UserElevationRow = {
  id: string;
  user_id: string;
  current_level: number;
  current_ep: number;
  total_ep: number;
  created_at: string;
  updated_at: string;
};

export type ElevationEventRow = {
  id: string;
  user_id: string;
  source_type: string;
  source_id: string | null;
  ep_amount: number;
  description: string;
  created_at: string;
};

export type LevelRewardRow = {
  id: string;
  level: number;
  title: string;
  description: string | null;
  reward_type: "title" | "badge" | "cosmetic";
  reward_value: string | null;
  status: ContentStatus;
};

export type LevelRewardViewModel = {
  level: number;
  title: string;
  description: string | null;
  rewardType: "title" | "badge" | "cosmetic";
};

export type ElevationSummaryViewModel = {
  currentLevel: number;
  currentEp: number;
  totalEp: number;
  epToNextLevel: number;
  levelProgressPercent: number;
  activeTitle: string | null;
  nextReward: LevelRewardViewModel | null;
  recentRewards: LevelRewardViewModel[];
};

export type ElevationAwardViewModel = {
  epAwarded: number;
  totalEp: number;
  currentLevel: number;
  currentEp: number;
  epToNextLevel: number;
  levelProgressPercent: number;
  leveledUp: boolean;
  rewardsUnlocked: LevelRewardViewModel[];
};
