import type { AchievementRarity } from "@/lib/content/types";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
import type { QuestDashboardViewModel } from "@/features/quests/types/quest.types";
import type { TrailNodeViewModel } from "@/features/learning/utils/trail-state";

export type HomeDashboardViewModel = {
  greeting: string;
  region: {
    name: string;
    trail: string;
  };
  level: {
    label: string;
    progressPercent: number;
  };
  elevation: {
    level: number;
    totalEp: number;
    currentEp: number;
    epToNextLevel: number;
    progressPercent: number;
    activeTitle: string | null;
    nextMilestone: string;
  };
  quests: QuestDashboardViewModel;
  yama: YamaPresenceViewModel;
  trailPreview: TrailNodeViewModel[];
  upcomingLesson: {
    title: string;
    href: string;
  };
  recentAchievements: Array<{
    id: string;
    title: string;
    rarity: AchievementRarity;
  }>;
  reviewQueueCount: number;
};
