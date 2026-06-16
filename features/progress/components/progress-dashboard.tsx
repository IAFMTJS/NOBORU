import Link from "next/link";

import { GlassPanel } from "@/components/visual";
import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import type { ProgressDashboardViewModel } from "@/features/progress/types/progress-dashboard.types";
import { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";
import { cn } from "@/lib/utils";

type ProgressDashboardProps = {
  dashboard: ProgressDashboardViewModel;
};

function JournalMarker({
  label,
  value,
  sublabel,
  lit = true,
}: {
  label: string;
  value: string;
  sublabel?: string;
  lit?: boolean;
}) {
  return (
    <div
      className={cn(
        glassSurface.card,
        "flex flex-col items-center gap-1.5 px-3 py-3 text-center",
        !lit && "opacity-75",
      )}
    >
      <WorldArtImage
        asset={INVENTORY_ITEM_ASSETS.stone_lantern}
        alt=""
        width={28}
        height={28}
        className={cn("drop-shadow-md", lit ? "trail-glow-warm opacity-95" : "opacity-50 saturate-50")}
      />
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-foreground">{value}</p>
      {sublabel ? <p className="text-[10px] text-muted-foreground">{sublabel}</p> : null}
    </div>
  );
}

function findDomain(dashboard: ProgressDashboardViewModel, domain: string) {
  return dashboard.domains.find((entry) => entry.domain === domain);
}

export function ProgressDashboard({ dashboard }: ProgressDashboardProps) {
  const vocabulary = findDomain(dashboard, "vocabulary");
  const kanji = findDomain(dashboard, "kanji");

  return (
    <SecondaryScreenShell
      title="Expedition journal"
      subtitle="Milestones inked along your climb — simple, supportive, never corporate"
      backHref="/profile"
      backLabel="Profile"
      contentClassName="pb-2"
    >
      <div className="mx-auto max-w-md">
        <GlassPanel className="p-4">
          <h2 className="mb-3 font-sans text-body font-semibold tracking-wide">Trail distance</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <JournalMarker
              label="Lessons"
              value={`${dashboard.learningStats.lessonsCompleted}/${dashboard.learningStats.lessonsTotal}`}
            />
            <JournalMarker
              label="Words"
              value={`${vocabulary?.learnedCount ?? 0}/${vocabulary?.totalCount ?? 0}`}
            />
            <JournalMarker
              label="Kanji"
              value={`${kanji?.learnedCount ?? 0}/${kanji?.totalCount ?? 0}`}
            />
            <JournalMarker
              label="Streak"
              value={`${dashboard.currentStreak} days`}
              lit={dashboard.currentStreak > 0}
            />
            <JournalMarker
              label="Elevation"
              value={`Lv ${dashboard.elevation.currentLevel}`}
              sublabel={`${dashboard.elevation.totalEp.toLocaleString()} m climbed`}
            />
          </div>
        </GlassPanel>
        <p className="mt-4 text-center">
          <Link href="/learn" className="text-body-sm text-primary underline-offset-2 hover:underline">
            Return to trail
          </Link>
        </p>
      </div>
    </SecondaryScreenShell>
  );
}
