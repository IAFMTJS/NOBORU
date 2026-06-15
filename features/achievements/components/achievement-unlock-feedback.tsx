"use client";

import { useCallback, useEffect, useState } from "react";

import { AchievementRevealCeremony } from "@/components/visual/world/achievement-reveal-ceremony";
import type { AchievementUnlockViewModel } from "@/features/achievements/types/achievement.types";

type AchievementUnlockFeedbackProps = {
  achievements: AchievementUnlockViewModel[];
};

export function AchievementUnlockFeedback({
  achievements,
}: AchievementUnlockFeedbackProps) {
  const [queue, setQueue] = useState<AchievementUnlockViewModel[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (achievements.length === 0) return;
    setQueue(achievements);
    setActiveIndex(0);
  }, [achievements]);

  const handleDismiss = useCallback(() => {
    setActiveIndex((index) => {
      const nextIndex = index + 1;
      if (nextIndex >= queue.length) {
        setQueue([]);
        return 0;
      }
      return nextIndex;
    });
  }, [queue.length]);

  const activeAchievement = queue[activeIndex];

  if (!activeAchievement) return null;

  return (
    <AchievementRevealCeremony
      achievement={activeAchievement}
      open
      onDismiss={handleDismiss}
    />
  );
}
