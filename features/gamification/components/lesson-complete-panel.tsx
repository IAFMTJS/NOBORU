import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  GlassPanel,
  IllustratedScreen,
  PrimaryClimbButton,
  RewardChip,
  StoryTitle,
} from "@/components/visual";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import { cn } from "@/lib/utils";

export type LearnedItemPreview = {
  japanese: string;
  meaning: string;
};

export type LessonCompleteTrailPreview = {
  regionSlug: string;
  nextNodeLabel: string | null;
  unlocksRegionSlug?: string | null;
};

export type LessonCompletePanelProps = {
  score: number;
  passScore: number;
  xpReward: number;
  regionSlug: string;
  elevationAward?: ElevationAwardViewModel | null;
  learnedItems?: LearnedItemPreview[];
  celebrationTitle?: string;
  feedbackSlot?: ReactNode;
  achievementSlot?: ReactNode;
  questSlot?: ReactNode;
  nextLessonHref?: string | null;
  nextLessonTitle?: string | null;
  reviewItemsEnqueued?: number;
  trailHref: string;
  trailPreview?: LessonCompleteTrailPreview | null;
  className?: string;
};

export function LessonCompletePanel({
  score,
  passScore,
  xpReward,
  regionSlug,
  elevationAward = null,
  learnedItems = [],
  celebrationTitle,
  feedbackSlot,
  achievementSlot,
  questSlot,
  nextLessonHref = null,
  nextLessonTitle = null,
  reviewItemsEnqueued = 0,
  trailHref,
  trailPreview = null,
  className,
}: LessonCompletePanelProps) {
  const title =
    celebrationTitle ??
    (elevationAward?.leveledUp
      ? `Level ${elevationAward.currentLevel} reached`
      : "Lesson Complete");

  return (
    <IllustratedScreen className={cn("min-h-0 rounded-card", className)}>
      <div className="space-y-4 p-4">
        <header className="space-y-3 text-center">
          <YamaPresence
            presence={yamaService.resolveCelebration("lesson_complete")}
            size="md"
            layout="vertical"
            className="items-center"
          />
          <StoryTitle as="h2">{title}</StoryTitle>
          <RewardChip variant="xp" className="px-4 py-1 text-lg">
            +{xpReward} XP
          </RewardChip>
          <p className="text-caption text-muted-foreground">
            Score {score}% · Pass {passScore}%
            {elevationAward ? ` · +${elevationAward.epAwarded} EP` : ""}
          </p>
        </header>

        {elevationAward?.leveledUp ? (
          <GlassPanel className="p-3 text-center">
            <Badge variant="secondary">Level up! Now level {elevationAward.currentLevel}</Badge>
          </GlassPanel>
        ) : null}

        {elevationAward?.rewardsUnlocked.map((reward) => (
          <GlassPanel key={reward.level} className="p-3 text-center">
            <Badge variant="outline">Unlocked: {reward.title}</Badge>
          </GlassPanel>
        ))}

        {learnedItems.length > 0 ? (
          <GlassPanel className="space-y-2 p-4">
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              You learned
            </p>
            <ul className="space-y-2">
              {learnedItems.map((item) => (
                <li
                  key={`${item.japanese}-${item.meaning}`}
                  className="flex items-baseline justify-between gap-3 border-b border-glass-border/60 pb-2 last:border-0 last:pb-0"
                >
                  <span className="font-japanese text-body font-medium">{item.japanese}</span>
                  <span className="text-caption text-muted-foreground">{item.meaning}</span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        ) : null}

        {trailPreview ? (
          <GlassPanel className="space-y-2 p-4 text-center">
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Trail ahead
            </p>
            {trailPreview.unlocksRegionSlug ? (
              <p className="text-body-sm text-trail-glow">
                A new region opens on the mountain
              </p>
            ) : null}
            {trailPreview.nextNodeLabel ? (
              <p className="text-body-sm text-foreground">
                Next up: {trailPreview.nextNodeLabel}
              </p>
            ) : (
              <p className="text-body-sm text-muted-foreground">
                Continue climbing in {trailPreview.regionSlug.replace(/-/g, " ")}
              </p>
            )}
          </GlassPanel>
        ) : null}

        {achievementSlot}
        {questSlot}
        {feedbackSlot}

        <div className="space-y-2 pt-1">
          {nextLessonHref && nextLessonTitle ? (
            <PrimaryClimbButton asChild>
              <Link href={nextLessonHref}>Next lesson · {nextLessonTitle}</Link>
            </PrimaryClimbButton>
          ) : (
            <PrimaryClimbButton asChild>
              <Link href={trailHref}>Continue Climbing</Link>
            </PrimaryClimbButton>
          )}
          {reviewItemsEnqueued > 0 ? (
            <Link
              href={
                reviewItemsEnqueued > 5
                  ? "/review"
                  : `/review?limit=${Math.min(reviewItemsEnqueued, 5)}`
              }
              className="flex h-11 w-full items-center justify-center rounded-[var(--radius)] border border-glass-border text-body-sm font-medium transition-colors hover:bg-muted/40"
            >
              Review {reviewItemsEnqueued} new item
              {reviewItemsEnqueued === 1 ? "" : "s"}
            </Link>
          ) : null}
        </div>
      </div>
    </IllustratedScreen>
  );
}
