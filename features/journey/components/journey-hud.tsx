"use client";

import Link from "next/link";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { StoryTitle } from "@/components/visual/story-title";
import {
  JOURNEY_MOCKUP,
  resolveDisplayGemCount,
} from "@/features/journey/constants/journey-mockup.constants";
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

function StatChip({
  icon,
  value,
  label,
}: {
  icon: "flame" | "gem";
  value: number;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-white/90",
        JOURNEY_MOCKUP.glass.borderClass,
        "bg-black/35",
      )}
      aria-label={`${label}: ${value}`}
    >
      <UiIconImage name={icon} size={12} className="opacity-90" />
      {value}
    </span>
  );
}

/** Journey HUD — profile, place, streak, gems (mockup contract § HUD Composition). */
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
        JOURNEY_MOCKUP.glass.borderClass,
        JOURNEY_MOCKUP.glass.bgClass,
        className,
      )}
    >
      <Link
        href="/profile"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/20 text-xs font-semibold text-primary sm:h-9 sm:w-9 sm:text-sm"
        aria-label={`Profile: ${displayName}`}
      >
        {displayName.charAt(0).toUpperCase()}
      </Link>

      <button
        type="button"
        onClick={onRegionOverview}
        className={cn(
          "mx-auto inline-flex min-w-0 max-w-[42%] items-center gap-1 rounded-full border px-2.5 py-1 sm:max-w-[48%] sm:px-3",
          JOURNEY_MOCKUP.glass.borderClass,
          "bg-black/30",
        )}
      >
        <StoryTitle as="h1" className="truncate text-[10px] uppercase sm:text-xs text-white">
          {regionName}
        </StoryTitle>
        <UiIconImage name="chevron_down" size={12} className="shrink-0 opacity-70" />
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <p className="hidden text-[10px] text-white/70 sm:block">Lv {levelLabel}</p>
        <StatChip icon="flame" value={currentStreak} label="Streak" />
        <StatChip icon="gem" value={gemCount} label="Gems" />
      </div>
    </header>
  );
}
