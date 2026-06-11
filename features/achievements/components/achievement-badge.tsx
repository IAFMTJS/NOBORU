import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { stickerImageClass } from "@/lib/assets/image-presentation";
import { getAchievementArtPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";
import { ACHIEVEMENT_RARITY_LABELS } from "@/features/achievements/constants/achievement.constants";
import type { AchievementRarity } from "@/lib/content/types";

const RARITY_RING: Record<AchievementRarity, string> = {
  common: "ring-border",
  uncommon: "ring-secondary",
  rare: "ring-info/60",
  epic: "ring-success/70",
  legendary: "ring-warning shadow-[0_0_12px_hsl(var(--warning)/0.35)]",
  mythic: "ring-primary shadow-[0_0_16px_hsl(var(--primary)/0.45)]",
};

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
  slug?: string;
  name: string;
  rarity: AchievementRarity;
  unlocked?: boolean;
  className?: string;
  showLabel?: boolean;
};

export function AchievementBadge({
  slug,
  name,
  rarity,
  unlocked = true,
  className,
  showLabel = false,
}: AchievementBadgeProps) {
  const artPath = slug ? getAchievementArtPath(slug) : null;

  if (artPath) {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-1.5",
          !unlocked && "opacity-50 grayscale",
          className,
        )}
        title={`${name} — ${ACHIEVEMENT_RARITY_LABELS[rarity]}`}
      >
        <div
          className={cn(
            "relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-2",
            RARITY_RING[rarity],
          )}
        >
          <Image
            src={artPath}
            alt={name}
            fill
            className={stickerImageClass()}
            sizes="56px"
          />
        </div>
        {showLabel ? (
          <span className="max-w-[5.5rem] truncate text-center text-caption">
            {name}
          </span>
        ) : null}
      </div>
    );
  }

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
