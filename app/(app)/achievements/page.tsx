import Link from "next/link";

import { AchievementShowcase } from "@/features/achievements/components/achievement-showcase";
import { getAchievementShowcase } from "@/lib/orchestration/achievements.orchestrator";
import { Button } from "@/components/ui/button";

export default async function AchievementsPage() {
  const showcase = await getAchievementShowcase();

  return (
    <>
      <div className="fixed right-4 top-4 z-20">
        <Button variant="ghost" size="sm" className="glass-panel" asChild>
          <Link href="/profile">Profile</Link>
        </Button>
      </div>
      <AchievementShowcase showcase={showcase} />
    </>
  );
}
