import { AnalyticsLink } from "@/features/analytics/components/analytics-link";
import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { CircularProgress } from "@/components/ui/circular-progress";
import { ProgressBar } from "@/components/ui/progress-bar";
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
  profile?: {
    displayName: string;
    levelLabel: string;
    xpProgressPercent: number;
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
  profile,
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
        <div className="relative min-h-[24rem]">
          <SceneImage
            scene="camp_base"
            alt={`${regionName} base camp`}
            className="absolute inset-0 min-h-[24rem] rounded-none"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/80" />
          <div className="relative z-10 flex min-h-[24rem] flex-col justify-between p-4">
            <div className="space-y-1 pr-4">
              <p className="text-body-sm text-white/85">{greeting}</p>
              <p className="text-heading-3 font-bold text-white">
                Ready for today&apos;s climb?
              </p>
            </div>
            {yama ? <ExpeditionHeroYama yama={yama} /> : null}
            {profile ? (
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-sm">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/25 text-sm font-semibold text-primary"
                  aria-hidden
                >
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-caption font-medium text-white">
                      {profile.displayName}
                    </p>
                    <span className="shrink-0 text-caption text-white/70">
                      Lv {profile.levelLabel}
                    </span>
                  </div>
                  <ProgressBar
                    value={profile.xpProgressPercent}
                    className="space-y-0"
                    indicatorClassName="bg-trail-glow"
                  />
                </div>
              </div>
            ) : null}
            <DailyQuestBoard
              daily={quests.daily}
              weekly={quests.weekly}
              variant="camp"
              streakDays={stats.currentStreak}
            />
          </div>
        </div>
      </div>

      <GlassPanel className="p-3">
        <StoryTitle as="h3" className="mb-2 text-sm">
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
            <StoryTitle as="h3" className="text-sm">
              Current Trail
            </StoryTitle>
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

      <CompanionBadge companion={companion} />

      {progressionPreview.primaryUnlock ? (
        <NextUnlockPreview unlock={progressionPreview.primaryUnlock} compact />
      ) : null}

      <div className="grid grid-cols-3 gap-2 rounded-card border border-glass-border bg-glass-bg/60 px-3 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-1.5">
          <UiIconImage name="flame" size={16} />
          <span className="text-body-sm font-medium">{stats.currentStreak}</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 border-x border-glass-border">
          <UiIconImage name="gem" size={16} />
          <span className="text-body-sm font-medium">
            {stats.totalXp.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
          <UiIconImage name="trophy" size={16} />
          <span className="text-body-sm font-medium">—</span>
        </div>
      </div>
    </div>
  );
}
