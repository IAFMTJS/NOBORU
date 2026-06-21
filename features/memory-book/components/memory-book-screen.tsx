"use client";

import Link from "next/link";

import { GlassPanel, PrimaryClimbButton } from "@/components/visual";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";
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
    <SecondaryScreenShell
      title="Memory Book"
      subtitle="A journal of firsts along the climb"
      backHref="/profile"
      backLabel="Profile"
      contentClassName="pb-2"
    >
      <div className="mx-auto max-w-md space-y-4">
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

            <GlassPanel className="max-h-[min(36dvh,22rem)] overflow-y-auto p-2">
              <section aria-labelledby="memory-entries-heading">
                <h2 id="memory-entries-heading" className="sr-only">
                  Memory book entries
                </h2>
                {entries.length === 0 ? (
                  <div className="m-1 p-2">
                    <YamaEmptyState
                      surface="generic"
                      title="Blank pages await discovery"
                      description="Your first summit moments will inscribe themselves here as you climb."
                      actionHref="/tree"
                      actionLabel="Continue climbing"
                    />
                  </div>
                ) : (
                  <ul className="divide-y divide-border/40">
                    {entries.map((entry) => (
                      <li key={entry.id} className="py-1">
                        <MemoryBookEntry entry={entry} variant="page" />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </GlassPanel>
          </div>
        </MemoryBookSpread>

        <PrimaryClimbButton asChild className="mx-auto max-w-md">
          <Link href="/tree">Continue climbing</Link>
        </PrimaryClimbButton>
      </div>
    </SecondaryScreenShell>
  );
}
