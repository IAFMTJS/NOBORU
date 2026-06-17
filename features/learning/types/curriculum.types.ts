import type { ContentStatus } from "@/lib/content/types";

export type RegionRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  order_index: number;
  unlock_requirement: string | null;
  theme_id: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type RegionInput = {
  slug: string;
  name: string;
  description?: string | null;
  orderIndex?: number;
  unlockRequirement?: string | null;
  themeId?: string | null;
  status?: ContentStatus;
};

export type UnitRow = {
  id: string;
  region_id: string;
  name: string;
  description: string | null;
  order_index: number;
  estimated_duration: number | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type LessonRow = {
  id: string;
  unit_id: string;
  type: string;
  title: string;
  description: string | null;
  order_index: number;
  difficulty: number;
  xp_reward: number;
  estimated_duration: number | null;
  checkpoint_activity_mix?: string[] | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type LessonInput = {
  unitId: string;
  type?: string;
  title: string;
  description?: string | null;
  difficulty?: number;
  xpReward?: number;
  estimatedDuration?: number | null;
  status?: ContentStatus;
};
