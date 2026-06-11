import Link from "next/link";

import { AnalyticsLink } from "@/features/analytics/components/analytics-link";
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
import { RegionContentLinks } from "@/features/learning/components/region-content-links";
import { TrailMap } from "@/features/learning/components/trail/trail-map";
import { flattenRegionTrailLessons } from "@/features/learning/utils/trail-state";
import type { LearningPathViewModel } from "@/features/learning/types/lesson.types";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";
import { cn } from "@/lib/utils";

type LearningPathScreenProps = {
  path: LearningPathViewModel;
};

export function LearningPathScreen({ path }: LearningPathScreenProps) {
  return (
    <PageContainer>
      <ScreenHeader
        title="Learn"
        subtitle="Follow the trail upward, one node at a time."
      />

      {path.nextLesson && path.nextLessonHref ? (
        <Card className="border-primary/30 shadow-elevation-1">
          <CardHeader>
            <CardTitle>Continue Climbing</CardTitle>
            <CardDescription>
              {path.nextLesson.title}
              {path.nextLesson.estimatedDuration
                ? ` · ~${path.nextLesson.estimatedDuration} min`
                : ""}
              {path.nextLesson.xpReward
                ? ` · +${path.nextLesson.xpReward} XP`
                : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg" asChild>
              <AnalyticsLink
                href={path.nextLessonHref}
                eventName="trail_continue_clicked"
                eventProperties={{
                  source: "learn_path",
                  lessonId: path.nextLesson?.id ?? null,
                  lessonTitle: path.nextLesson?.title ?? null,
                }}
              >
                Start Next Lesson
              </AnalyticsLink>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        {path.regions.map((region) => {
          const regionLocked = region.availability === "locked";
          const visuals = getRegionVisuals(region.slug);

          return (
            <Card
              key={region.id}
              className={cn(
                "overflow-hidden bg-gradient-to-br to-card",
                visuals.gradient,
                visuals.border,
              )}
            >
              <RegionHeroImage
                regionSlug={region.slug}
                alt={`${region.name} region`}
              />
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle>{region.name}</CardTitle>
                      {regionLocked ? (
                        <Badge variant="outline">Locked</Badge>
                      ) : (
                        <Badge className={visuals.badge}>{visuals.label}</Badge>
                      )}
                    </div>
                    <CardDescription>{region.description}</CardDescription>
                  </div>
                </div>

                {regionLocked && region.lockReason ? (
                  <p className="text-body-sm text-muted-foreground">
                    {region.lockReason}
                  </p>
                ) : null}

                <ProgressBar
                  value={region.progressPercent}
                  label="Region progress"
                  showValue
                />
              </CardHeader>

              <CardContent className="space-y-4">
                <TrailMap
                  nodes={flattenRegionTrailLessons(region.units, { regionLocked })}
                  title="Trail map"
                  description={`${region.completedCount}/${region.lessonCount} lessons complete`}
                />

                {!regionLocked &&
                (region.slug === "mount-n5" || region.slug === "mount-n4") ? (
                  <RegionContentLinks
                    jlptLevel={region.slug === "mount-n4" ? "n4" : "n5"}
                    variant="chips"
                  />
                ) : null}

                {regionLocked ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/trials">View Trials</Link>
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/learn/${region.slug}`}>Open Region Trail</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}
