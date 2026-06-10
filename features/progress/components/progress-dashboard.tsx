import Link from "next/link";

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
import { ElevationSummary } from "@/features/elevation/components/elevation-summary";
import { AchievementShowcase } from "@/features/achievements/components/achievement-showcase";
import type { AchievementShowcaseViewModel } from "@/features/achievements/types/achievement.types";
import { TrailQuestCards } from "@/features/quests/components/trail-quest-cards";
import type { QuestDashboardViewModel } from "@/features/quests/types/quest.types";
import type { ProgressDashboardViewModel } from "@/features/progress/types/progress-dashboard.types";
import { ReviewStatsPanel } from "@/features/review/components/review-stats-panel";

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
        title="Progress"
        subtitle="Your climb at a glance"
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/home">Home</Link>
          </Button>
        }
      />

      <Card className="border-primary/20 shadow-elevation-1">
        <CardHeader>
          <CardTitle>Overall Mastery</CardTitle>
          <CardDescription>
            Average progress across all learning domains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={dashboard.overallMasteryPercent}
            label="Overall mastery"
            showValue
          />
        </CardContent>
      </Card>

      <ElevationSummary summary={dashboard.elevation} />

      <TrailQuestCards daily={quests.daily} weekly={quests.weekly} />

      <AchievementShowcase showcase={achievements} compact />

      <Card className="shadow-elevation-1">
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

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Learning Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border px-4 py-3 text-center">
            <p className="text-caption text-muted-foreground">Lessons</p>
            <p className="text-heading-5">
              {dashboard.learningStats.lessonsCompleted}/
              {dashboard.learningStats.lessonsTotal}
            </p>
          </div>
          <div className="rounded-xl border border-border px-4 py-3 text-center">
            <p className="text-caption text-muted-foreground">In Progress</p>
            <p className="text-heading-5">{dashboard.learningStats.lessonsInProgress}</p>
          </div>
          <div className="rounded-xl border border-border px-4 py-3 text-center">
            <p className="text-caption text-muted-foreground">Avg Score</p>
            <p className="text-heading-5">{dashboard.learningStats.averageScore}%</p>
          </div>
          <div className="rounded-xl border border-border px-4 py-3 text-center">
            <p className="text-caption text-muted-foreground">Reading</p>
            <p className="text-heading-5">
              {dashboard.learningStats.readingCompleted}/
              {dashboard.learningStats.readingTotal}
            </p>
          </div>
          <div className="rounded-xl border border-border px-4 py-3 text-center">
            <p className="text-caption text-muted-foreground">Listening</p>
            <p className="text-heading-5">
              {dashboard.learningStats.listeningCompleted}/
              {dashboard.learningStats.listeningTotal}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Region Progress</CardTitle>
          <CardDescription>Completion across each trail region</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dashboard.regions.map((region) => (
            <div key={region.id} className="space-y-3 rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-body font-medium">{region.name}</p>
                  <p className="text-caption text-muted-foreground">
                    {region.completedCount}/{region.lessonCount} lessons
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{region.progressPercent}%</Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/learn/${region.slug}`}>Open</Link>
                  </Button>
                </div>
              </div>
              <ProgressBar value={region.progressPercent} label={region.name} showValue />
              {region.units.length > 0 ? (
                <div className="space-y-2 border-t border-border pt-3">
                  {region.units.map((unit) => (
                    <div
                      key={unit.id}
                      className="flex items-center justify-between gap-3 text-body-sm"
                    >
                      <span className="text-muted-foreground">{unit.name}</span>
                      <span>
                        {unit.completedCount}/{unit.lessonCount} · {unit.progressPercent}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-heading-6">Review Statistics</h2>
        <ReviewStatsPanel stats={dashboard.reviewStats} />
      </div>
    </PageContainer>
  );
}
