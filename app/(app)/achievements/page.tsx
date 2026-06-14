import { AchievementShowcase } from "@/features/achievements/components/achievement-showcase";
import { getAchievementShowcase } from "@/lib/orchestration/achievements.orchestrator";

export default async function AchievementsPage() {
  const showcase = await getAchievementShowcase();

  return <AchievementShowcase showcase={showcase} />;
}
