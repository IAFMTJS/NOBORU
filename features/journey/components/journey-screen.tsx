"use client";

import { JourneyHud } from "@/features/journey/components/journey-hud";
import { JourneyWorldCanvas } from "@/features/journey/components/journey-world-canvas";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";

type JourneyScreenProps = {
  journey: JourneyPathViewModel;
  regionName: string;
  focusYPercent?: number | null;
  profileStats?: {
    displayName: string;
    levelLabel: string;
    currentStreak: number;
    totalXp: number;
  } | null;
};

/** Journey tab — World Tree ascent canvas with HUD overlay. */
export function JourneyScreen({
  journey,
  regionName,
  focusYPercent = null,
  profileStats,
}: JourneyScreenProps) {
  return (
    <div className="relative h-content min-h-0 overflow-hidden bg-[#E9E1D0] dark:bg-[#0D1320]">
      <JourneyWorldCanvas
        className="absolute inset-0"
        journey={journey}
        regionName={regionName}
        focusYPercent={focusYPercent}
      />

      {profileStats ? (
        <JourneyHud
          displayName={profileStats.displayName}
          levelLabel={profileStats.levelLabel}
          regionName={regionName}
          currentStreak={profileStats.currentStreak}
          totalXp={profileStats.totalXp}
          onRegionOverview={() => undefined}
        />
      ) : null}
    </div>
  );
}
