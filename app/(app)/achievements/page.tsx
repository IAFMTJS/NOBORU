import Link from "next/link";

import { AchievementShowcase } from "@/features/achievements/components/achievement-showcase";
import { getAchievementShowcase } from "@/lib/orchestration/achievements.orchestrator";
import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";

export default async function AchievementsPage() {
  const showcase = await getAchievementShowcase();

  return (
    <PageContainer>
      <ScreenHeader
        title="Achievements"
        subtitle="Milestones earned on your climb"
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/profile">Profile</Link>
          </Button>
        }
      />
      <AchievementShowcase showcase={showcase} />
    </PageContainer>
  );
}
