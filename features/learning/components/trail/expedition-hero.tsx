import { Flame, Gem, Star } from "lucide-react";

import { AnalyticsLink } from "@/features/analytics/components/analytics-link";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
import { RegionHeroImage } from "@/components/media/region-hero-image";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { TrailQuestCards } from "@/features/quests/components/trail-quest-cards";
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
  continueLessonTitle,
  continueHref,
  lessonNumber,
  lessonCount,
  regionProgressPercent,
  quests,
  yama,
  stats,
}: ExpeditionHeroProps) {
  const lessonLabel =
    lessonNumber && lessonCount > 0
      ? `Lesson ${lessonNumber} of ${lessonCount}`
      : null;

  return (
    <div className="space-y-5">
      <div className="relative -mx-4 overflow-hidden sm:mx-0 sm:rounded-2xl">
        <div className="relative min-h-[17.5rem]">
          <RegionHeroImage
            regionSlug={regionSlug}
            alt={`${regionName} base camp`}
            className="absolute inset-0 h-full min-h-[17.5rem] rounded-none"
            hideOverlay
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-background" />
          <div className="relative z-10 flex min-h-[17.5rem] flex-col justify-between p-4">
            <div className="space-y-1 pr-24">
              <p className="text-body-sm text-white/85">{greeting}</p>
              <p className="text-heading-3 font-bold text-white">
                Ready for today&apos;s climb?
              </p>
            </div>
            <div className="absolute bottom-4 left-4 max-w-[6.5rem]">
              <YamaPresence presence={yama} size="md" layout="vertical" priority />
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "space-y-4 rounded-2xl border border-border/50 bg-card p-4 shadow-elevation-1",
        )}
      >
        <div className="space-y-1">
          <p className="text-body-sm font-semibold">Continue Your Climb</p>
          <p className="text-caption text-muted-foreground">
            {regionName} · {continueLessonTitle}
          </p>
          {lessonLabel ? (
            <p className="text-caption text-muted-foreground">{lessonLabel}</p>
          ) : null}
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-body-sm font-medium">{continueLessonTitle}</p>
          </div>
          <CircularProgress
            value={regionProgressPercent}
            size={56}
            strokeWidth={5}
            className="shrink-0"
          />
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
      </div>

      <TrailQuestCards daily={quests.daily} variant="compact" />

      <div className="grid grid-cols-3 gap-2 rounded-xl border border-border/50 bg-card/80 px-3 py-3">
        <div className="flex items-center justify-center gap-1.5">
          <Flame className="h-4 w-4 shrink-0 text-warning" aria-hidden />
          <span className="text-body-sm font-medium">{stats.currentStreak}</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 border-x border-border/50">
          <Star className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span className="text-body-sm font-medium">
            {stats.totalXp.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
          <Gem className="h-4 w-4 shrink-0" aria-hidden />
          <span className="text-body-sm font-medium">—</span>
        </div>
      </div>
    </div>
  );
}
