import type { ProfileViewModel } from "@/features/profile/types/profile.types";
import type {
  CampAboveFoldViewModel,
  CampBelowFoldViewModel,
} from "@/features/camp/types/camp.types";
import { streakService } from "@/features/achievements/services/streak.service";
import { yamaService } from "@/features/yama/services/yama.service";
import {
  getCachedElevationSummary,
  getCachedQuestDashboard,
} from "@/lib/cache/dashboard-cache";
import { settingsServerService } from "@/features/settings/services/settings-server.service";
import { chestService } from "@/features/chests/services/chest.service";
import { shrineProtectionService } from "@/features/streak-protection/services/shrine-protection.service";

const EMPTY_SHRINE: CampBelowFoldViewModel["shrineProtection"] = {
  tokensAvailable: 0,
  tokensUsed: 0,
};

class DashboardServerService {
  async getCampAboveFold(profile: ProfileViewModel): Promise<CampAboveFoldViewModel> {
    const [elevation, quests, settings, currentStreak, chests] = await Promise.all([
      getCachedElevationSummary(profile.userId),
      getCachedQuestDashboard(profile.userId),
      settingsServerService.getSettings(),
      streakService.getCurrentStreak(profile.userId),
      chestService.listEligible(profile.userId),
    ]);

    const yama = yamaService.resolveHomePresence(
      {
        dailyQuestsCompleted: quests.daily.completedCount,
        dailyQuestsTotal: quests.daily.totalCount,
        regionProgressPercent: 0,
        hasInProgressTrailNode: false,
      },
      profile.userId.length,
    );

    return {
      greeting: `Kon'nichiwa, ${profile.displayName}`,
      level: {
        label: profile.levelLabel,
      },
      stats: {
        currentStreak,
        totalXp: elevation.totalEp,
      },
      dailyGoal: {
        targetMinutes: settings?.dailyGoalMinutes ?? 15,
        progressPercent:
          quests.daily.totalCount === 0
            ? 0
            : Math.round(
                (quests.daily.completedCount / quests.daily.totalCount) * 100,
              ),
        label: `${quests.daily.completedCount}/${quests.daily.totalCount} daily quests`,
      },
      quests: {
        daily: quests.daily,
      },
      yama,
      chests,
    };
  }

  async getCampBelowFold(userId: string): Promise<CampBelowFoldViewModel> {
    const shrineProtection = await shrineProtectionService.getSummary(userId);
    return {
      shrineProtection,
      quests: {
        weekly: {
          weekStart: "",
          completedCount: 0,
          totalCount: 0,
          quests: [],
        },
      },
    };
  }

  campBelowFoldDefaults(): CampBelowFoldViewModel {
    return {
      shrineProtection: EMPTY_SHRINE,
      quests: {
        weekly: {
          weekStart: "",
          completedCount: 0,
          totalCount: 0,
          quests: [],
        },
      },
    };
  }
}

export const dashboardServerService = new DashboardServerService();
