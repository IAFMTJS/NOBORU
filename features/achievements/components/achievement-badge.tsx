import Image from "next/image";

import { getAchievementArtPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";
import { ACHIEVEMENT_RARITY_LABELS } from "@/features/achievements/constants/achievement.constants";
import type { AchievementRarity } from "@/lib/content/types";

const RARITY_RING: Record<AchievementRarity, string> = {
  common: "ring-border/80",
  uncommon: "ring-secondary/70",
  rare: "ring-info/60",
  epic: "ring-success/70",
  legendary: "ring-warning shadow-[0_0_12px_hsl(var(--warning)/0.35)]",
  mythic: "ring-primary shadow-[0_0_16px_hsl(var(--primary)/0.45)]",
};

type AchievementBadgeProps = {
  slug?: string;
  name: string;
  rarity: AchievementRarity;
  unlocked?: boolean;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
};

const SIZE_CLASSES = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "h-20 w-20",
} as const;

export function AchievementBadge({
  slug,
  name,
  rarity,
  unlocked = true,
  className,
  showLabel = false,
  size = "md",
}: AchievementBadgeProps) {
  const src = getAchievementArtPath(slug);

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
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 glass-panel bg-muted/30",
          SIZE_CLASSES[size],
          RARITY_RING[rarity],
        )}
      >
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            aria-hidden
            className="object-contain p-1.5"
            sizes={size === "lg" ? "80px" : size === "md" ? "64px" : "48px"}
          />
        ) : null}
      </div>
      {showLabel ? (
        <span className="max-w-[5.5rem] truncate text-center text-caption">
          {name}
        </span>
      ) : null}
      <span className="sr-only">{name}</span>
    </div>
  );
}
