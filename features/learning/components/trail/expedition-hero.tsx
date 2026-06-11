import Link from "next/link";
import { Flame, Star } from "lucide-react";

import { AnalyticsLink } from "@/features/analytics/components/analytics-link";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
import { RegionHeroImage } from "@/components/media/region-hero-image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { TrailQuestCards } from "@/features/quests/components/trail-quest-cards";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";
import { cn } from "@/lib/utils";
import type { QuestDashboardViewModel } from "@/features/quests/types/quest.types";

type ExpeditionHeroProps = {
  greeting: string;
  regionSlug: string;
  regionName: string;
  trailName: string;
  regionProgressPercent: number;
  continueLessonTitle: string;
  continueHref: string;
  lessonNumber: number | null;
  lessonCount: number;
  estimatedDuration: number | null;
  quests: QuestDashboardViewModel;
  yama: YamaPresenceViewModel;
  stats: {
    currentStreak: number;
    totalXp: number;
  };
};

export function ExpeditionHero({
  greeting,
  regionSlug,
  regionName,
  trailName,
  regionProgressPercent,
  continueLessonTitle,
  continueHref,
  lessonNumber,
  lessonCount,
  estimatedDuration,
  quests,
  yama,
  stats,
}: ExpeditionHeroProps) {
  const region = getRegionVisuals(regionSlug);
  const lessonLabel =
    lessonNumber && lessonCount > 0
      ? `Lesson ${lessonNumber} of ${lessonCount}`
      : null;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-heading-4">{greeting}</h1>
        <p className="text-body-sm text-muted-foreground">
          Ready for today&apos;s climb?
        </p>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border shadow-elevation-2 dark:shadow-elevation-3",
          region.border,
        )}
      >
        <RegionHeroImage
          regionSlug={regionSlug}
          alt={`${regionName} base camp`}
          className="h-40 rounded-none sm:h-44"
        />
        <div className="absolute bottom-3 right-3 max-w-[7rem]">
          <YamaPresence presence={yama} size="md" layout="vertical" priority />
        </div>
      </div>

      <Card
        className={cn(
          "overflow-hidden border bg-gradient-to-br shadow-elevation-1",
          region.gradient,
          region.border,
        )}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-heading-5">Continue Your Climb</CardTitle>
          <CardDescription>
            {regionName} · {continueLessonTitle}
          </CardDescription>
          {lessonLabel ? (
            <p className="text-caption text-muted-foreground">{lessonLabel}</p>
          ) : (
            <p className="text-caption text-muted-foreground">{trailName}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <CircularProgress
              value={regionProgressPercent}
              size={88}
              strokeWidth={8}
              sublabel={trailName}
              className="shrink-0"
            />
            <div className="min-w-0 space-y-1">
              <p className="text-body-sm font-medium">{continueLessonTitle}</p>
              {estimatedDuration ? (
                <p className="text-caption text-muted-foreground">
                  ~{estimatedDuration} min on the trail
                </p>
              ) : null}
            </div>
          </div>
          <Button size="lg" className="w-full" asChild>
            <AnalyticsLink
              href={continueHref}
              eventName="trail_continue_clicked"
              eventProperties={{
                source: "home_expedition",
                lessonTitle: continueLessonTitle,
              }}
            >
              Continue Climbing
            </AnalyticsLink>
          </Button>
        </CardContent>
      </Card>

      <TrailQuestCards daily={quests.daily} />

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/80 bg-card/60 p-3">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-warning" aria-hidden />
          <div>
            <p className="text-body-sm font-medium">{stats.currentStreak} day streak</p>
            <p className="text-caption text-muted-foreground">Steady ascent</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" aria-hidden />
          <div>
            <p className="text-body-sm font-medium">
              {stats.totalXp.toLocaleString()} XP
            </p>
            <p className="text-caption text-muted-foreground">Elevation earned</p>
          </div>
        </div>
      </div>

      <Button variant="outline" size="sm" className="w-full" asChild>
        <Link href="/learn">View full trail</Link>
      </Button>
    </div>
  );
}
