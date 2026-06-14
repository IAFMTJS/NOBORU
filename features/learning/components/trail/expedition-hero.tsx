import { AnalyticsLink } from "@/features/analytics/components/analytics-link";
import { RegionHeroImage } from "@/components/media/region-hero-image";
import { CircularProgress } from "@/components/ui/circular-progress";
import { GlassPanel } from "@/components/visual/glass-panel";
import { PrimaryClimbButton } from "@/components/visual/primary-climb-button";
import { StoryTitle } from "@/components/visual/story-title";
import { JourneyPreviewMap } from "@/features/journey/components/journey-preview-map";
import { ExpeditionHeroYama } from "@/features/learning/components/trail/expedition-hero-yama";
import { DailyQuestBoard } from "@/features/gamification/components/daily-quest-board";
import type { QuestDashboardViewModel } from "@/features/quests/types/quest.types";
import { NextUnlockPreview } from "@/components/progression/next-unlock-preview";
import { CompanionBadge } from "@/features/companion/components/companion-badge";
import type { CompanionViewModel } from "@/features/companion/types/companion.types";
import type { ProgressionPreviewViewModel } from "@/lib/progression/preview.types";
import type { JourneyNode } from "@/features/journey/types/journey.types";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";

type ExpeditionHeroProps = {
  greeting: string;
  regionSlug: string;
  regionName: string;
  regionProgressPercent: number;
  continueLessonTitle: string;
  continueHref: string;
  lessonNumber: number | null;
  lessonCount: number;
  journeyPreview: JourneyNode[];
  currentJourneyNodeId: string | null;
  quests: QuestDashboardViewModel;
  yama: YamaPresenceViewModel;
  stats: {
    currentStreak: number;
    totalXp: number;
  };
  companion: CompanionViewModel;
  progressionPreview: ProgressionPreviewViewModel;
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
  journeyPreview,
  currentJourneyNodeId,
  quests,
  yama,
  stats,
  companion,
  progressionPreview,
}: ExpeditionHeroProps) {
  const lessonLabel =
    lessonNumber && lessonCount > 0
      ? `Lesson ${lessonNumber} of ${lessonCount}`
      : null;

  return (
    <div className="space-y-5">
      <div className="relative -mx-4 overflow-hidden sm:mx-0 sm:rounded-2xl">
        <div className="relative min-h-[19rem]">
          <RegionHeroImage
            regionSlug={regionSlug}
            alt={`${regionName} base camp`}
            className="absolute inset-0 h-full min-h-[19rem] rounded-none"
            hideOverlay
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-background" />
          <div className="relative z-10 flex min-h-[19rem] flex-col justify-between p-4 pb-36 sm:pb-40">
            <div className="space-y-1 pr-4">
              <p className="text-body-sm text-white/85">{greeting}</p>
              <p className="text-heading-3 font-bold text-white">
                Ready for today&apos;s climb?
              </p>
            </div>
            {yama ? <ExpeditionHeroYama yama={yama} /> : null}
          </div>
        </div>
      </div>

      <GlassPanel className="p-3">
        <StoryTitle as="h3" className="mb-2 text-sm normal-case tracking-wide">
          Continue Your Climb
        </StoryTitle>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="truncate text-body-sm font-medium">
              {regionName} · {continueLessonTitle}
            </p>
            {lessonLabel ? (
              <p className="text-caption text-muted-foreground">{lessonLabel}</p>
            ) : null}
          </div>
          <CircularProgress
            value={regionProgressPercent}
            size={48}
            strokeWidth={4}
            className="shrink-0"
          />
        </div>

        <PrimaryClimbButton className="mt-3" asChild>
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
        </PrimaryClimbButton>
      </GlassPanel>

      {journeyPreview.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-caption font-semibold">Current Trail</p>
            <AnalyticsLink
              href="/learn/world"
              className="text-caption font-medium text-primary hover:underline"
              eventName="trail_map_opened"
              eventProperties={{ source: "home_trail_preview" }}
            >
              View map
            </AnalyticsLink>
          </div>
          <JourneyPreviewMap
            regionSlug={regionSlug}
            nodes={journeyPreview}
            currentNodeId={currentJourneyNodeId}
          />
        </div>
      ) : null}

      <DailyQuestBoard
        daily={quests.daily}
        variant="compact"
        streakDays={stats.currentStreak}
      />

      <CompanionBadge companion={companion} />

      {progressionPreview.primaryUnlock ? (
        <NextUnlockPreview unlock={progressionPreview.primaryUnlock} compact />
      ) : null}

      <GlassPanel className="grid grid-cols-3 gap-2 px-3 py-3">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-trail-glow text-body-sm" aria-hidden>
            🔥
          </span>
          <span className="text-body-sm font-medium">{stats.currentStreak}</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 border-x border-glass-border">
          <span className="text-xp-gold text-body-sm" aria-hidden>
            ✦
          </span>
          <span className="text-body-sm font-medium">
            {stats.totalXp.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
          <span className="text-reward text-body-sm" aria-hidden>
            ◆
          </span>
          <span className="text-body-sm font-medium">—</span>
        </div>
      </GlassPanel>
    </div>
  );
}
