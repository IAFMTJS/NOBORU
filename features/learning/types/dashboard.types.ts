import type { AchievementRarity } from "@/lib/content/types";
import type { ProgressionPreviewViewModel } from "@/lib/progression/preview.types";
import type { CompanionViewModel } from "@/features/companion/types/companion.types";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
import type { QuestDashboardViewModel } from "@/features/quests/types/quest.types";
import type { TrailNodeViewModel, TrailPlacementRange } from "@/features/learning/types/trail.types";

export type HomeDashboardViewModel = {
  greeting: string;
  region: {
    slug: string;
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
  trailPreviewPlacement: TrailPlacementRange;
  upcomingLesson: {
    title: string;
    href: string;
    lessonNumber: number | null;
    lessonCount: number;
    estimatedDuration: number | null;
  };
  stats: {
    currentStreak: number;
    totalXp: number;
  };
  recentAchievements: Array<{
    id: string;
    slug: string;
    title: string;
    rarity: AchievementRarity;
  }>;
  reviewQueueCount: number;
  readyTrial: {
    title: string;
    href: string;
  } | null;
  gamesAvailable: boolean;
  progressionPreview: ProgressionPreviewViewModel;
  companion: CompanionViewModel;
  dailyGoal: {
    targetMinutes: number;
    progressPercent: number;
    label: string;
  };
};
