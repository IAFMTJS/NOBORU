import { AnalyticsLink } from "@/features/analytics/components/analytics-link";
import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { CircularProgress } from "@/components/ui/circular-progress";
import { ProgressBar } from "@/components/ui/progress-bar";
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
  achievementCount?: number;
  reviewQueueCount?: number;
  dailyGoalLabel?: string;
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
  achievementCount = 0,
  reviewQueueCount = 0,
  dailyGoalLabel,
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
        <div className="relative min-h-[28rem]">
          <SceneImage
            scene="camp_base"
            alt={`${regionName} base camp`}
            className="absolute inset-0 min-h-[28rem] rounded-none"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/65" />
          <div className="relative z-10 flex min-h-[28rem] flex-col gap-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="text-body-sm text-white/85">{greeting}</p>
                <StoryTitle as="h2" className="text-xl text-white">
                  Ready for today&apos;s climb?
                </StoryTitle>
                {dailyGoalLabel ? (
                  <p className="text-caption text-white/70">{dailyGoalLabel}</p>
                ) : null}
              </div>
              {yama ? <ExpeditionHeroYama yama={yama} /> : null}
            </div>

            {profile ? (
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-sm">
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
                <div className="flex shrink-0 items-center gap-2 border-l border-white/10 pl-3 text-caption text-white/90">
                  <span className="inline-flex items-center gap-0.5" title="Current streak">
                    <UiIconImage name="flame" size={12} />
                    {stats.currentStreak}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-reward" title="Total XP">
                    <UiIconImage name="gem" size={12} />
                    {stats.totalXp.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-0.5" title="Achievements">
                    <UiIconImage name="trophy" size={12} />
                    {achievementCount}
                  </span>
                </div>
              </div>
            ) : null}

            <div className="flex-1" />

            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0 max-w-[45%] flex-1 space-y-2">
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-sm">
                  <CircularProgress
                    value={regionProgressPercent}
                    size={40}
                    strokeWidth={3}
                    className="shrink-0 text-trail-glow"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <StoryTitle as="h3" className="text-xs text-white/90">
                      Continue Your Climb
                    </StoryTitle>
                    <p className="truncate text-caption font-medium text-white">
                      {regionName} · {continueLessonTitle}
                    </p>
                    {lessonLabel ? (
                      <p className="text-[10px] text-white/60">{lessonLabel}</p>
                    ) : null}
                    {reviewQueueCount > 0 ? (
                      <p className="text-[10px] text-trail-glow">
                        {reviewQueueCount} review{reviewQueueCount === 1 ? "" : "s"} due
                      </p>
                    ) : null}
                  </div>
                </div>
                <PrimaryClimbButton className="w-full shadow-lg" asChild>
                  <AnalyticsLink
                    href={continueHref}
                    eventName="trail_continue_clicked"
                    eventProperties={{
                      source: "home_expedition_hero",
                      lessonTitle: continueLessonTitle,
                    }}
                  >
                    Continue Climbing
                  </AnalyticsLink>
                </PrimaryClimbButton>
              </div>

              <div className="w-[min(100%,15rem)] shrink-0">
                <DailyQuestBoard
                  daily={quests.daily}
                  weekly={quests.weekly}
                  variant="camp"
                  streakDays={stats.currentStreak}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}
