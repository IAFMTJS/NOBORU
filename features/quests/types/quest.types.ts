import type { ContentStatus } from "@/lib/content/types";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";
import type {
  QuestMetric,
  QuestPeriod,
} from "@/features/quests/constants/quest.constants";

export type QuestTemplateRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  metric: QuestMetric;
  target_value: number;
  ep_reward: number;
  sort_order: number;
  period: QuestPeriod;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type UserDailyQuestRow = {
  id: string;
  user_id: string;
  quest_template_id: string;
  quest_date: string;
  progress: number;
  target_value: number;
  completed: boolean;
  completed_at: string | null;
  ep_awarded: number | null;
  created_at: string;
  updated_at: string;
};

export type UserWeeklyQuestRow = {
  id: string;
  user_id: string;
  quest_template_id: string;
  week_start: string;
  progress: number;
  target_value: number;
  completed: boolean;
  completed_at: string | null;
  ep_awarded: number | null;
  created_at: string;
  updated_at: string;
};

export type QuestViewModel = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  current: number;
  target: number;
  completed: boolean;
  epReward: number;
  href: string;
  progressPercent: number;
};

export type DailyQuestsViewModel = {
  questDate: string;
  quests: QuestViewModel[];
  completedCount: number;
  totalCount: number;
};

export type WeeklyQuestsViewModel = {
  weekStart: string;
  quests: QuestViewModel[];
  completedCount: number;
  totalCount: number;
};

export type QuestDashboardViewModel = {
  daily: DailyQuestsViewModel;
  weekly: WeeklyQuestsViewModel;
};

export type QuestCompletionViewModel = {
  id: string;
  slug: string;
  title: string;
  epAwarded: number;
  elevation: ElevationAwardViewModel | null;
  period: QuestPeriod;
};

export type UserDailyQuestWithTemplate = UserDailyQuestRow & {
  template: QuestTemplateRow;
};

export type UserWeeklyQuestWithTemplate = UserWeeklyQuestRow & {
  template: QuestTemplateRow;
};

export type QuestProgressTarget = {
  id: string;
  userId: string;
  progress: number;
  targetValue: number;
  completed: boolean;
  template: QuestTemplateRow;
  period: QuestPeriod;
};
