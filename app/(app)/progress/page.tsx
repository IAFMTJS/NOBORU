import { ProgressDashboard } from "@/features/progress/components/progress-dashboard";
import { getProgressDashboard } from "@/lib/orchestration/progress.orchestrator";
import { getAchievementShowcase } from "@/lib/orchestration/achievements.orchestrator";
import { getQuestDashboard } from "@/lib/orchestration/quests.orchestrator";

export default async function ProgressPage() {
  const [dashboard, achievements, quests] = await Promise.all([
    getProgressDashboard(),
    getAchievementShowcase(),
    getQuestDashboard(),
  ]);

  return (
    <ProgressDashboard
      dashboard={dashboard}
      achievements={achievements}
      quests={quests}
    />
  );
}
