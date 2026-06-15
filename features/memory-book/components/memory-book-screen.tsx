"use client";

import Link from "next/link";

import { SceneImage } from "@/components/media/scene-image";
import {
  GlassPanel,
  IllustratedScreen,
  PrimaryClimbButton,
  StoryTitle,
} from "@/components/visual";
import { MemoryBookSpread } from "@/components/visual/world/memory-book-spread";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import { MemoryBookEntry } from "@/features/memory-book/components/memory-book-entry";
import type { MemoryBookViewModel } from "@/features/memory-book/types/memory-book.types";
import { NAV_TAB_MASCOT_ASSETS } from "@/lib/assets/art-mappings";

type MemoryBookScreenProps = {
  memoryBook: MemoryBookViewModel;
};

export function MemoryBookScreen({ memoryBook }: MemoryBookScreenProps) {
  const { entries, totalFirsts } = memoryBook;

  return (
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="memory_book_journal"
          alt="Weathered travel journal on a camp table"
          className="absolute inset-0 min-h-dvh rounded-none"
          priority
        />
      }
    >
      <div className="relative flex min-h-dvh flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70"
          aria-hidden
        />

        <header className="relative z-10 shrink-0 p-4 pt-3 text-center">
          <StoryTitle as="h1" className="text-lg text-white drop-shadow-md">
            Memory Book
          </StoryTitle>
          <p className="mt-1 text-caption text-white/70">
            A journal of firsts along the climb
          </p>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-2">
          <div className="mx-auto max-w-md">
            <MemoryBookSpread className="min-h-[min(52dvh,28rem)]">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 text-left">
                    <p className="font-story text-xl text-trail-glow">{totalFirsts} firsts</p>
                    <p className="text-caption text-muted-foreground">
                      Milestones worth remembering — not streaks worth stressing over.
                    </p>
                  </div>
                  <WorldArtImage
                    asset={NAV_TAB_MASCOT_ASSETS.study}
                    alt="Noboru reading the memory book"
                    width={72}
                    height={72}
                    className="shrink-0 drop-shadow-md"
                  />
                </div>

                <section
                  aria-labelledby="memory-entries-heading"
                  className="max-h-[min(36dvh,22rem)] overflow-y-auto rounded-xl border border-amber-200/10 bg-black/25 px-2 py-2"
                >
                  <h2 id="memory-entries-heading" className="sr-only">
                    Memory book entries
                  </h2>
                  {entries.length === 0 ? (
                    <div className="m-1 p-2">
                      <YamaEmptyState
                        surface="generic"
                        title="Blank pages await discovery"
                        description="Your first summit moments will inscribe themselves here as you climb."
                        actionHref="/learn"
                        actionLabel="Continue climbing"
                      />
                    </div>
                  ) : (
                    <ul className="divide-y divide-amber-200/10">
                      {entries.map((entry) => (
                        <li key={entry.id} className="py-1">
                          <MemoryBookEntry entry={entry} variant="page" />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </MemoryBookSpread>
          </div>
        </main>

        <footer className="relative z-10 shrink-0 p-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-2">
          <PrimaryClimbButton asChild className="mx-auto max-w-md">
            <Link href="/learn">Continue climbing</Link>
          </PrimaryClimbButton>
        </footer>
      </div>
    </IllustratedScreen>
  );
}
