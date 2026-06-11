"use client";

import { Badge } from "@/components/ui/badge";
import { MotionDiv } from "@/components/motion/motion-div";
import type { AchievementUnlockViewModel } from "@/features/achievements/types/achievement.types";
import { AchievementBadge } from "@/features/achievements/components/achievement-badge";
import { YamaReaction } from "@/features/yama/components/yama-reaction";
import { scaleIn } from "@/lib/motion/presets";
import { yamaService } from "@/features/yama/services/yama.service";

type AchievementUnlockFeedbackProps = {
  achievements: AchievementUnlockViewModel[];
};

export function AchievementUnlockFeedback({
  achievements,
}: AchievementUnlockFeedbackProps) {
  if (achievements.length === 0) return null;

  return (
    <MotionDiv
      {...scaleIn}
      initial="initial"
      animate="animate"
      className="space-y-3 rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-4 shadow-elevation-2"
    >
      <YamaReaction presence={yamaService.resolveAchievementReaction()} />
      <p className="text-body-sm font-medium">Achievement unlocked</p>
      {achievements.map((achievement) => (
        <div
          key={achievement.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/60 p-3"
        >
          <AchievementBadge
            slug={achievement.slug}
            name={achievement.name}
            rarity={achievement.rarity}
            showLabel
          />
          <Badge variant="outline">+{achievement.epAwarded} EP</Badge>
        </div>
      ))}
    </MotionDiv>
  );
}
