"use client";

import { useEffect, useState } from "react";

import { AchievementUnlockFeedback } from "@/features/achievements/components/achievement-unlock-feedback";
import { QuestCompleteFeedback } from "@/features/quests/components/quest-complete-feedback";
import { YamaCelebration } from "@/features/yama/components/yama-celebration";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MotionDiv } from "@/components/motion/motion-div";
import { yamaService } from "@/features/yama/services/yama.service";
import { scaleIn } from "@/lib/motion/presets";
import type { OfflineSyncGamificationResult } from "@/lib/offline/types";

type OfflineSyncRewardsFeedbackProps = {
  rewards: OfflineSyncGamificationResult | null;
  onDismiss: () => void;
};

export function OfflineSyncRewardsFeedback({
  rewards,
  onDismiss,
}: OfflineSyncRewardsFeedbackProps) {
  const [visible, setVisible] = useState(Boolean(rewards));

  useEffect(() => {
    setVisible(Boolean(rewards));
  }, [rewards]);

  if (!rewards || !visible) return null;

  const hasRewards =
    rewards.elevation ||
    rewards.achievements.length > 0 ||
    rewards.quests.length > 0;

  if (!hasRewards) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 px-4 sm:bottom-6 sm:px-6">
      <MotionDiv
        {...scaleIn}
        initial="initial"
        animate="animate"
        className="mx-auto max-w-lg space-y-3 rounded-xl border border-primary/25 bg-black/50 p-4 shadow-elevation-3 backdrop-blur-md"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-body-sm font-medium">Offline progress synced</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setVisible(false);
              onDismiss();
            }}
          >
            Dismiss
          </Button>
        </div>

        {rewards.elevation ? (
          <>
            <YamaCelebration
              presence={yamaService.resolveCelebration(
                rewards.elevation.leveledUp ? "level_up" : "lesson_complete",
              )}
              title={
                rewards.elevation.leveledUp
                  ? `Level ${rewards.elevation.currentLevel} reached`
                  : `+${rewards.elevation.epAwarded} EP earned`
              }
            />
            {rewards.elevation.leveledUp ? (
              <Badge variant="secondary">
                Level up! Now level {rewards.elevation.currentLevel}
              </Badge>
            ) : null}
          </>
        ) : null}

        <AchievementUnlockFeedback achievements={rewards.achievements} />
        <QuestCompleteFeedback completions={rewards.quests} />
      </MotionDiv>
    </div>
  );
}
