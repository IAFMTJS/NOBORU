import { Badge } from "@/components/ui/badge";
import type { AchievementUnlockViewModel } from "@/features/achievements/types/achievement.types";
import { AchievementBadge } from "@/features/achievements/components/achievement-badge";
import { YamaReaction } from "@/features/yama/components/yama-reaction";
import { yamaService } from "@/features/yama/services/yama.service";

type AchievementUnlockFeedbackProps = {
  achievements: AchievementUnlockViewModel[];
};

export function AchievementUnlockFeedback({
  achievements,
}: AchievementUnlockFeedbackProps) {
  if (achievements.length === 0) return null;

  return (
    <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
      <YamaReaction presence={yamaService.resolveAchievementReaction()} />
      <p className="text-body-sm font-medium">Achievement unlocked</p>
      {achievements.map((achievement) => (
        <div
          key={achievement.id}
          className="flex flex-wrap items-center justify-between gap-2"
        >
          <AchievementBadge name={achievement.name} rarity={achievement.rarity} />
          <Badge variant="outline">+{achievement.epAwarded} EP</Badge>
        </div>
      ))}
    </div>
  );
}
