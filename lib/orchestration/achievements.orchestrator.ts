import { achievementService } from "@/features/achievements/services/achievement.service";
import type { AchievementShowcaseViewModel } from "@/features/achievements/types/achievement.types";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

export async function getAchievementShowcase(): Promise<AchievementShowcaseViewModel> {
  const userId = await requireAuthenticatedUserId();
  return achievementService.getShowcase(userId);
}
