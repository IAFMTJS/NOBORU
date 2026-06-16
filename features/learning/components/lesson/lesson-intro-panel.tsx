"use client";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { WorldBossNode } from "@/components/visual/world/world-boss-node";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import { ExpeditionMarker } from "@/features/learning/components/lesson/expedition-marker";
import { GlassPanel, IllustratedScreen, PrimaryClimbButton, StoryTitle } from "@/components/visual";
import { cn } from "@/lib/utils";

type LessonIntroPanelProps = {
  title: string;
  description: string | null;
  lessonType: string;
  xpReward: number;
  isReview: boolean;
  alreadyCompleted: boolean;
  loading?: boolean;
  onStart: () => void;
};

function lessonDifficultyLabel(lessonType: string): string {
  if (lessonType === "application" || lessonType === "trial" || lessonType === "boss") {
    return "Summit trial";
  }
  if (lessonType === "checkpoint") return "Checkpoint";
  if (lessonType === "listening" || lessonType === "conversation") return "Focused";
  return "Trail pace";
}

export function LessonIntroPanel({
  title,
  description,
  lessonType,
  xpReward,
  isReview,
  alreadyCompleted,
  loading = false,
  onStart,
}: LessonIntroPanelProps) {
  const isBossTrial =
    lessonType === "application" || lessonType === "trial" || lessonType === "boss";

  return (
    <IllustratedScreen className="flex flex-1 flex-col justify-center py-4">
      <div className="relative mx-auto w-full max-w-md space-y-5 px-1">
        {isBossTrial ? (
          <div className="flex justify-center py-2">
            <WorldBossNode state="available" isCurrent />
          </div>
        ) : null}

        <div className="space-y-3 text-center">
          <p className="text-caption uppercase tracking-[0.2em] text-trail-glow/90">
            Expedition briefing
          </p>
          <StoryTitle as="h1" className="text-2xl">
            {title}
          </StoryTitle>
          {description ? (
            <p className="text-body-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <ExpeditionMarker label="Challenge" value={lessonDifficultyLabel(lessonType)} />
          <ExpeditionMarker
            label="Reward"
            value={
              <span className="inline-flex items-center gap-1">
                <UiIconImage name="gem" size={14} />
                {xpReward} XP
              </span>
            }
          />
          <ExpeditionMarker label="Mode" value={isReview ? "Review" : "First climb"} />
        </div>

        <GlassPanel
          className={cn("space-y-3 p-4", isBossTrial && "ring-1 ring-primary/25")}
        >
          <YamaPresence
            presence={
              isBossTrial
                ? yamaService.resolveCelebration("trial_boss")
                : yamaService.resolveLessonIntroPresence(0)
            }
            size="md"
            layout="vertical"
            showMessage={false}
            className="items-center"
          />
          <p className="text-center text-caption text-muted-foreground">
            {isReview
              ? "Practice this stretch of the trail again."
              : "The path ahead awaits — step forward when ready."}
          </p>
        </GlassPanel>

        <PrimaryClimbButton className="w-full" loading={loading} onClick={onStart}>
          {alreadyCompleted ? "Review expedition" : "Begin climb"}
        </PrimaryClimbButton>
      </div>
    </IllustratedScreen>
  );
}
