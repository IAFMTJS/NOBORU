import type { CompanionViewModel } from "@/features/companion/types/companion.types";
import type { CollectibleViewModel } from "@/features/collectibles/types/collectible.types";
import type { ChestEligibilityViewModel } from "@/features/chests/types/chest.types";
import type { ShrineProtectionViewModel } from "@/features/streak-protection/types/shrine-protection.types";
import type { ProgressionPreviewViewModel } from "@/lib/progression/preview.types";

export type CampDashboardViewModel = {
  companion: CompanionViewModel;
  collectibles: CollectibleViewModel[];
  chests: ChestEligibilityViewModel[];
  shrineProtection: ShrineProtectionViewModel;
  preview: ProgressionPreviewViewModel;
  achievementCount: number;
  currentStreak: number;
};
