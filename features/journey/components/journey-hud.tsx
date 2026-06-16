"use client";

import Link from "next/link";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { NavStatChip } from "@/components/visual/navigation";
import { StoryTitle } from "@/components/visual/primitives";
import {
  VISUAL_MOCKUP,
  resolveDisplayGemCount,
} from "@/components/visual/tokens";
import { cn } from "@/lib/utils";

type JourneyHudProps = {
  displayName: string;
  levelLabel: string;
  regionName: string;
  currentStreak?: number;
  totalXp?: number;
  onRegionOverview: () => void;
  className?: string;
};

/** Journey HUD — profile, place, streak, gems (mockup contract). */
export function JourneyHud({
  displayName,
  levelLabel,
  regionName,
  currentStreak = 0,
  totalXp = 0,
  onRegionOverview,
  className,
}: JourneyHudProps) {
  const gemCount = resolveDisplayGemCount(totalXp);

  return (
    <header
      className={cn(
        "absolute inset-x-3 top-3 z-30 flex items-center gap-1.5 rounded-card border px-2 py-1.5 sm:inset-x-4 sm:gap-2 sm:px-2.5",
        VISUAL_MOCKUP.glass.borderClass,
        VISUAL_MOCKUP.glass.bgClass,
        className,
      )}
    >
      <Link
        href="/profile"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/20 text-caption font-semibold text-primary sm:h-9 sm:w-9 sm:text-body-sm"
        aria-label={`Profile: ${displayName}`}
      >
        {displayName.charAt(0).toUpperCase()}
      </Link>

      <button
        type="button"
        onClick={onRegionOverview}
        className={cn(
          "mx-auto inline-flex min-w-0 max-w-[48%] items-center gap-1 rounded-full border px-2.5 py-1 sm:px-3",
          VISUAL_MOCKUP.glass.borderClass,
          "bg-black/30",
        )}
      >
        <StoryTitle as="h1" className="truncate text-caption uppercase text-white sm:text-body-sm">
          {regionName}
        </StoryTitle>
        <UiIconImage name="chevron_down" size={12} className="shrink-0 opacity-70" />
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <p className="text-caption text-white/70">Lv {levelLabel}</p>
        <NavStatChip icon="flame" value={currentStreak} label="Streak" />
        <NavStatChip icon="gem" value={gemCount} label="Gems" className="text-violet-200" />
      </div>
    </header>
  );
}
