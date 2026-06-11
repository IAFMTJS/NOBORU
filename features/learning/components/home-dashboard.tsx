import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { PageContainer } from "@/components/layout/page-container";
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
      <ExpeditionHero
        greeting={data.greeting}
        regionSlug={data.region.slug}
        regionName={data.region.name}
        trailName={data.region.trail}
        regionProgressPercent={data.level.progressPercent}
        continueLessonTitle={data.upcomingLesson.title}
        continueHref={data.upcomingLesson.href}
        lessonNumber={data.upcomingLesson.lessonNumber}
        lessonCount={data.upcomingLesson.lessonCount}
        estimatedDuration={data.upcomingLesson.estimatedDuration}
        quests={data.quests}
        yama={data.yama}
        stats={data.stats}
      />

      <PwaInstallPrompt />

      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-heading-6">Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentAchievements.length === 0 ? (
            <EmptyState
              yamaExpression="encouraging"
              title="Your first badge awaits"
              description="Complete a lesson on the trail and Yama will celebrate with you."
              actionLabel="Start learning"
              actionHref="/learn"
              className="py-8"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.recentAchievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  slug={achievement.slug}
                  name={achievement.title}
                  rarity={achievement.rarity}
                  showLabel
                />
              ))}
            </div>
          )}
          {data.reviewQueueCount > 0 ? (
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <Link href="/review">Review Queue ({data.reviewQueueCount})</Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
