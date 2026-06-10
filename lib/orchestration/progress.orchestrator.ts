import { getCachedProgressRows } from "@/lib/cache/user-progress-cache";
import { learningPathRepository } from "@/features/learning/repositories/learning-path.repository";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import { progressDashboardService } from "@/features/progress/services/progress-dashboard.service";
import type { ProgressDashboardViewModel } from "@/features/progress/types/progress-dashboard.types";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

export async function getProgressDashboard(): Promise<ProgressDashboardViewModel> {
  const userId = await requireAuthenticatedUserId();

  const [progressRows, regions, passedTrialSlugs] = await Promise.all([
    getCachedProgressRows(userId),
    learningPathRepository.listPublishedRegionsWithCurriculum(),
    learningPathService.getPassedTrialSlugs(userId),
  ]);

  const learningPath = learningPathService.buildLearningPath(
    regions,
    progressRows,
    passedTrialSlugs,
  );

  return progressDashboardService.getDashboard(userId, {
    progressRows,
    learningPath,
  });
}
