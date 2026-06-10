import { AnalyticsLink } from "@/features/analytics/components/analytics-link";
import { YamaPresence } from "@/features/yama/components/yama-presence";import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
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
import type { QuestDashboardViewModel } from "@/features/quests/types/quest.types";
import type { TrailNodeViewModel } from "@/features/learning/utils/trail-state";

type ExpeditionHeroProps = {
  greeting: string;
  regionName: string;
  trailName: string;
  levelLabel: string;
  regionProgressPercent: number;
  elevationLevel: number;
  elevationEp: number;
  activeTitle: string | null;
  continueLessonTitle: string;
  continueHref: string;
  trailPreview: TrailNodeViewModel[];
  quests: QuestDashboardViewModel;
  yama: YamaPresenceViewModel;
};

export function ExpeditionHero({
  greeting,
  regionName,
  trailName,
  levelLabel,
  regionProgressPercent,
  elevationLevel,
  elevationEp,
  activeTitle,
  continueLessonTitle,
  continueHref,
  trailPreview,
  quests,
  yama,
}: ExpeditionHeroProps) {
  return (
    <Card className="overflow-hidden border-primary/25 bg-gradient-to-br from-primary/5 via-card to-card shadow-elevation-2">
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
                <Badge variant="secondary">{levelLabel}</Badge>
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
              size="md"
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
