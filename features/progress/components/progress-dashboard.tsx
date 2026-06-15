import Link from "next/link";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { SceneImage } from "@/components/media/scene-image";
import { GlassPanel, IllustratedScreen, StoryTitle } from "@/components/visual";
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
        "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center",
        lit
          ? "border-trail-glow/40 bg-black/40 shadow-[0_0_12px_hsl(var(--trail-glow)/0.12)]"
          : "border-white/10 bg-black/30",
      )}
    >
      <WorldArtImage
        asset={INVENTORY_ITEM_ASSETS.stone_lantern}
        alt=""
        width={28}
        height={28}
        className={cn(
          "drop-shadow-md",
          lit ? "trail-glow-warm opacity-95" : "opacity-50 saturate-50",
        )}
      />
      <p className="text-[10px] uppercase tracking-wide text-white/60">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-white">{value}</p>
      {sublabel ? (
        <p className="text-[10px] text-muted-foreground">{sublabel}</p>
      ) : null}
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
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="memory_book_journal"
          alt=""
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      <div className="relative flex min-h-dvh flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/80"
          aria-hidden
        />

        <header className="relative z-10 shrink-0 space-y-3 p-4 pt-3">
          <Link
            href="/camp"
            className="inline-flex items-center gap-1.5 text-body-sm text-white/70 transition-colors hover:text-white"
          >
            <UiIconImage name="arrow_left" size={16} />
            Camp
          </Link>

          <div className="space-y-1 rounded-card border border-amber-900/30 bg-black/45 p-3">
            <StoryTitle as="h1" className="text-base">
              Expedition journal
            </StoryTitle>
            <p className="text-caption text-muted-foreground">
              Milestones inked along your climb — simple, supportive, never corporate
            </p>
          </div>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-2 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border border-amber-900/25 bg-gradient-to-b from-amber-950/25 to-black/50 p-4">
              <StoryTitle as="h2" className="mb-3 text-sm">
                Trail distance
              </StoryTitle>
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
            </div>
          </div>
        </main>
      </div>
    </IllustratedScreen>
  );
}
