import Image from "next/image";

import { stickerImageClass } from "@/lib/assets/image-presentation";
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

function BadgePlaceholder({
  name,
  rarity,
  unlocked,
  size,
  className,
  showLabel,
}: Omit<AchievementBadgeProps, "slug">) {
  const placeholderArt = getAchievementArtPath("first-step");
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
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 glass-panel",
          SIZE_CLASSES[size ?? "md"],
          RARITY_RING[rarity],
        )}
        aria-hidden
      >
        {placeholderArt ? (
          <Image
            src={placeholderArt}
            alt=""
            fill
            className={stickerImageClass("opacity-40")}
            sizes="48px"
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

export function AchievementBadge({
  slug,
  name,
  rarity,
  unlocked = true,
  className,
  showLabel = false,
  size = "md",
}: AchievementBadgeProps) {
  const artPath = slug ? getAchievementArtPath(slug) : null;
  const dimension = SIZE_CLASSES[size];

  if (!artPath) {
    return (
      <BadgePlaceholder
        name={name}
        rarity={rarity}
        unlocked={unlocked}
        size={size}
        className={className}
        showLabel={showLabel}
      />
    );
  }

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
          "relative shrink-0 overflow-hidden rounded-full ring-2",
          dimension,
          RARITY_RING[rarity],
        )}
      >
        <Image
          src={artPath}
          alt={name}
          fill
          className={stickerImageClass()}
          sizes={size === "lg" ? "80px" : size === "sm" ? "48px" : "64px"}
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
