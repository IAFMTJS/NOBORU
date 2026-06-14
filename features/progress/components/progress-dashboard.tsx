import Link from "next/link";

import { regionTrailHref } from "@/features/learning/utils/trail-navigation";

import { CircularProgress } from "@/components/ui/circular-progress";
import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { RegionHeroImage } from "@/components/media/region-hero-image";
import { ElevationSummary } from "@/features/elevation/components/elevation-summary";
import { AchievementShowcase } from "@/features/achievements/components/achievement-showcase";
import type { AchievementShowcaseViewModel } from "@/features/achievements/types/achievement.types";
import { TrailQuestCards } from "@/features/quests/components/trail-quest-cards";
import type { QuestDashboardViewModel } from "@/features/quests/types/quest.types";
import type { ProgressDashboardViewModel } from "@/features/progress/types/progress-dashboard.types";
import { ReviewStatsPanel } from "@/features/review/components/review-stats-panel";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";
import { cn } from "@/lib/utils";

type ProgressDashboardProps = {
  dashboard: ProgressDashboardViewModel;
  achievements: AchievementShowcaseViewModel;
  quests: QuestDashboardViewModel;
};

export function ProgressDashboard({
  dashboard,
  achievements,
  quests,
}: ProgressDashboardProps) {
  return (
    <PageContainer>
      <ScreenHeader
        variant="story"
        title="Progress"
        subtitle="Your climb at a glance"
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/camp">Camp</Link>
          </Button>
        }
      />

      <Card className="border-primary/20 shadow-elevation-1 dark:shadow-elevation-2">
        <CardHeader>
          <CardTitle>Overall Mastery</CardTitle>
          <CardDescription>
            Average progress across all learning domains
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
          <CircularProgress
            value={dashboard.overallMasteryPercent}
            label="Overall mastery"
            sublabel="All domains"
          />
          <div className="grid w-full max-w-xs grid-cols-2 gap-3 sm:max-w-none sm:flex-1">
            <div className="rounded-xl border border-border px-3 py-2 text-center">
              <p className="text-caption text-muted-foreground">Lessons</p>
              <p className="text-body-sm font-medium">
                {dashboard.learningStats.lessonsCompleted}/
                {dashboard.learningStats.lessonsTotal}
              </p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2 text-center">
              <p className="text-caption text-muted-foreground">Avg score</p>
              <p className="text-body-sm font-medium">
                {dashboard.learningStats.averageScore}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ElevationSummary summary={dashboard.elevation} />

      <TrailQuestCards daily={quests.daily} weekly={quests.weekly} />

      <AchievementShowcase showcase={achievements} compact />

      <Card className="shadow-elevation-1 dark:shadow-elevation-2">
        <CardHeader>
          <CardTitle className="text-heading-6">Domain Mastery</CardTitle>
          <CardDescription>Progress by content type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dashboard.domains.map((domain) => (
            <div key={domain.domain} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-body-sm font-medium">{domain.label}</p>
                <span className="text-caption text-muted-foreground">
                  {domain.learnedCount}/{domain.totalCount}
                </span>
              </div>
              <ProgressBar
                value={domain.progressPercent}
                label={domain.label}
                showValue
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1 dark:shadow-elevation-2">
        <CardHeader>
          <CardTitle className="text-heading-6">Region Progress</CardTitle>
          <CardDescription>Completion across each trail region</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dashboard.regions.map((region) => {
            const visuals = getRegionVisuals(region.slug);
            return (
            <div
              key={region.id}
              className={cn(
                "space-y-3 overflow-hidden rounded-xl border p-0 shadow-elevation-1",
                visuals.border,
              )}
            >
              <RegionHeroImage regionSlug={region.slug} alt={region.name} />
              <div className="space-y-3 px-4 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-body font-medium">{region.name}</p>
                  <p className="text-caption text-muted-foreground">
                    {region.completedCount}/{region.lessonCount} lessons
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={visuals.badge}>{region.progressPercent}%</Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={regionTrailHref(region.slug)}>Open</Link>
                  </Button>
                </div>
              </div>
              <ProgressBar value={region.progressPercent} label={region.name} showValue />
              </div>
            </div>
          );
          })}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-heading-6">Review Statistics</h2>
        <ReviewStatsPanel stats={dashboard.reviewStats} />
      </div>
    </PageContainer>
  );
}
