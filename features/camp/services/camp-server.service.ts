import { achievementService } from "@/features/achievements/services/achievement.service";
import { streakService } from "@/features/achievements/services/streak.service";
import { companionService } from "@/features/companion/services/companion.service";
import { chestService } from "@/features/chests/services/chest.service";
import { collectibleService } from "@/features/collectibles/services/collectible.service";
import { shrineProtectionService } from "@/features/streak-protection/services/shrine-protection.service";
import type { CampDashboardViewModel } from "@/features/camp/types/camp.types";
import { progressionPreviewService } from "@/lib/progression/preview.service";

class CampServerService {
  async getCampDashboard(
    userId: string,
    regionSlug: string,
  ): Promise<CampDashboardViewModel> {
    const [
      companion,
      collectibles,
      chests,
      shrineProtection,
      preview,
      achievements,
      currentStreak,
    ] = await Promise.all([
      companionService.getCompanion(userId),
      collectibleService.listAll(userId),
      chestService.listEligible(userId),
      shrineProtectionService.getSummary(userId),
      progressionPreviewService.getPreview(userId, regionSlug),
      achievementService.listRecentUnlocked(userId),
      streakService.getCurrentStreak(userId),
    ]);

    return {
      companion,
      collectibles,
      chests,
      shrineProtection,
      preview,
      achievementCount: achievements.length,
      currentStreak,
    };
  }
}

export const campServerService = new CampServerService();
