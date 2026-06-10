import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { AchievementBadge } from "@/features/achievements/components/achievement-badge";
import { ExpeditionHero } from "@/features/learning/components/trail/expedition-hero";
import { PwaInstallPrompt } from "@/features/offline/components/pwa-install-prompt";
import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type HomeDashboardProps = {
  data: HomeDashboardViewModel;
};

export function HomeDashboard({ data }: HomeDashboardProps) {
  return (
    <PageContainer>
      <ScreenHeader
        subtitle="Your expedition base camp"
        title="Home"
      />

      <ExpeditionHero
        greeting={data.greeting}
        regionName={data.region.name}
        trailName={data.region.trail}
        levelLabel={data.level.label}
        regionProgressPercent={data.level.progressPercent}
        elevationLevel={data.elevation.level}
        elevationEp={data.elevation.totalEp}
        activeTitle={data.elevation.activeTitle}
        continueLessonTitle={data.upcomingLesson.title}
        continueHref={data.upcomingLesson.href}
        trailPreview={data.trailPreview}
        quests={data.quests}
        yama={data.yama}
      />

      <PwaInstallPrompt />

      <Card className="shadow-elevation-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-heading-6">Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {data.recentAchievements.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">
              Complete lessons to earn your first badge.
            </p>
          ) : (
            data.recentAchievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                name={achievement.title}
                rarity={achievement.rarity}
              />
            ))
          )}
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/review">Review Queue ({data.reviewQueueCount})</Link>
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
