import type { CompanionViewModel } from "@/features/companion/types/companion.types";
import type { CollectibleViewModel } from "@/features/collectibles/types/collectible.types";
import type { ChestEligibilityViewModel } from "@/features/chests/types/chest.types";
import type { ShrineProtectionViewModel } from "@/features/streak-protection/types/shrine-protection.types";
import type { ProgressionPreviewViewModel } from "@/lib/progression/preview.types";
import type { QuestDashboardViewModel } from "@/features/quests/types/quest.types";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";

export type CampDashboardViewModel = {
  companion: CompanionViewModel;
  collectibles: CollectibleViewModel[];
  chests: ChestEligibilityViewModel[];
  shrineProtection: ShrineProtectionViewModel;
  preview: ProgressionPreviewViewModel;
  achievementCount: number;
  currentStreak: number;
};

export type CampAboveFoldViewModel = {
  greeting: string;
  level: {
    label: string;
  };
  stats: {
    currentStreak: number;
    totalXp: number;
  };
  dailyGoal: {
    targetMinutes: number;
    progressPercent: number;
    label: string;
  };
  quests: Pick<QuestDashboardViewModel, "daily">;
  yama: YamaPresenceViewModel;
  chests: ChestEligibilityViewModel[];
};

export type CampBelowFoldViewModel = {
  shrineProtection: ShrineProtectionViewModel;
  quests: Pick<QuestDashboardViewModel, "weekly">;
};

export type CampScreenViewModel = Omit<CampAboveFoldViewModel, "quests"> & {
  shrineProtection: ShrineProtectionViewModel;
  quests: {
    daily: CampAboveFoldViewModel["quests"]["daily"];
    weekly: CampBelowFoldViewModel["quests"]["weekly"];
  };
};
