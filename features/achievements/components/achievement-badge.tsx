import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ACHIEVEMENT_RARITY_LABELS } from "@/features/achievements/constants/achievement.constants";
import type { AchievementRarity } from "@/lib/content/types";

const RARITY_VARIANTS: Record<
  AchievementRarity,
  "outline" | "secondary" | "info" | "success" | "warning" | "default"
> = {
  common: "outline",
  uncommon: "secondary",
  rare: "info",
  epic: "success",
  legendary: "warning",
  mythic: "default",
};

type AchievementBadgeProps = {
  name: string;
  rarity: AchievementRarity;
  unlocked?: boolean;
  className?: string;
};

export function AchievementBadge({
  name,
  rarity,
  unlocked = true,
  className,
}: AchievementBadgeProps) {
  return (
    <Badge
      variant={RARITY_VARIANTS[rarity]}
      className={cn(!unlocked && "opacity-60", className)}
      title={ACHIEVEMENT_RARITY_LABELS[rarity]}
    >
      {name}
    </Badge>
  );
}
