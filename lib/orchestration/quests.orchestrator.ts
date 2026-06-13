import { getCachedQuestDashboard } from "@/lib/cache/dashboard-cache";
import { questService } from "@/features/quests/services/quest.service";
import type {
  DailyQuestsViewModel,
  QuestDashboardViewModel,
} from "@/features/quests/types/quest.types";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

export async function getQuestDashboard(): Promise<QuestDashboardViewModel> {
  const userId = await requireAuthenticatedUserId();
  return getCachedQuestDashboard(userId);
}

export async function getDailyQuests(): Promise<DailyQuestsViewModel> {
  const userId = await requireAuthenticatedUserId();
  return questService.getDailyQuests(userId);
}
