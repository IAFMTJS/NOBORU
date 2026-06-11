import Link from "next/link";

import { AnalyticsLink } from "@/features/analytics/components/analytics-link";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
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
import { TrailQuestCards } from "@/features/quests/components/trail-quest-cards";
import { TrailMap } from "@/features/learning/components/trail/trail-map";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";
import { cn } from "@/lib/utils";
import type { QuestDashboardViewModel } from "@/features/quests/types/quest.types";
import type { TrailNodeViewModel } from "@/features/learning/utils/trail-state";

type ExpeditionHeroProps = {
  greeting: string;
  regionSlug: string;
  regionName: string;
  trailName: string;
  levelLabel: string;
  regionProgressPercent: number;
  elevationLevel: number;
  elevationEp: number;
  elevationProgressPercent: number;
  epToNextLevel: number;
  activeTitle: string | null;
  continueLessonTitle: string;
  continueHref: string;
  reviewQueueCount: number;
  readyTrial: { title: string; href: string } | null;
  gamesAvailable: boolean;
  dailyGoal: {
    targetMinutes: number;
    progressPercent: number;
    label: string;
  };
  trailPreview: TrailNodeViewModel[];
  quests: QuestDashboardViewModel;
  yama: YamaPresenceViewModel;
};

export function ExpeditionHero({
  greeting,
  regionSlug,
  regionName,
  trailName,
  levelLabel,
  regionProgressPercent,
  elevationLevel,
  elevationEp,
  elevationProgressPercent,
  epToNextLevel,
  activeTitle,
  continueLessonTitle,
  continueHref,
  reviewQueueCount,
  readyTrial,
  gamesAvailable,
  dailyGoal,
  trailPreview,
  quests,
  yama,
}: ExpeditionHeroProps) {
  const region = getRegionVisuals(regionSlug);

  return (
    <Card
      className={cn(
        "overflow-hidden border bg-gradient-to-br shadow-elevation-2 dark:shadow-elevation-3",
        region.gradient,
        region.border,
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardDescription>{greeting}</CardDescription>
            <CardTitle className="text-heading-3">Continue Your Climb</CardTitle>
            <div className="space-y-1">
              <p className="text-body-sm font-medium">
                {regionName} · {trailName}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={region.badge}>{levelLabel}</Badge>
                <Badge variant="outline">
                  Level {elevationLevel} · {elevationEp.toLocaleString()} EP
                </Badge>
                {activeTitle ? (
                  <Badge variant="outline">{activeTitle}</Badge>
                ) : null}
              </div>
            </div>
          </div>
          <div className="max-w-[11rem] shrink-0">
            <YamaPresence
              presence={yama}
              size="lg"
              layout="vertical"
              priority
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProgressBar
          value={regionProgressPercent}
          label="Region trail progress"
          showValue
        />
        <ProgressBar
          value={elevationProgressPercent}
          label={`Level ${elevationLevel} elevation · ${epToNextLevel.toLocaleString()} EP to next`}
          showValue
        />
        <ProgressBar
          value={dailyGoal.progressPercent}
          label={`Daily climb · ${dailyGoal.targetMinutes} min goal · ${dailyGoal.label}`}
          showValue
        />
        {reviewQueueCount > 0 ? (
          <Button variant="secondary" size="lg" className="w-full" asChild>
            <Link href="/review?limit=5">
              Quick Review · {reviewQueueCount} due
            </Link>
          </Button>
        ) : null}
        <Button size="lg" className="w-full" asChild>
          <AnalyticsLink
            href={continueHref}
            eventName="trail_continue_clicked"
            eventProperties={{
              source: "home_expedition",
              lessonTitle: continueLessonTitle,
            }}
          >
            Continue Climbing · {continueLessonTitle}
          </AnalyticsLink>
        </Button>
        <div className="flex flex-wrap gap-2">
          {readyTrial ? (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={readyTrial.href}>Trial ready · {readyTrial.title}</Link>
            </Button>
          ) : null}
          {gamesAvailable ? (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/games/word-match">Quick sprint</Link>
            </Button>
          ) : null}
        </div>
        {trailPreview.length > 0 ? (
          <TrailMap
            nodes={trailPreview}
            compact
            title="Trail ahead"
            description="Your next steps on the mountain"
          />
        ) : null}
        <TrailQuestCards daily={quests.daily} weekly={quests.weekly} />
      </CardContent>
    </Card>
  );
}

