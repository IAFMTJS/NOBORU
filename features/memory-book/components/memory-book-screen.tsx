"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import {
  GlassPanel,
  IllustratedScreen,
  PrimaryClimbButton,
  StoryTitle,
} from "@/components/visual";
import { MemoryBookEntry } from "@/features/memory-book/components/memory-book-entry";
import type { MemoryBookViewModel } from "@/features/memory-book/types/memory-book.types";

type MemoryBookScreenProps = {
  memoryBook: MemoryBookViewModel;
};

export function MemoryBookScreen({ memoryBook }: MemoryBookScreenProps) {
  const { entries, totalFirsts } = memoryBook;

  return (
    <IllustratedScreen
      scrim="minimal"
      background={
        <div className="h-full bg-gradient-to-b from-trail-glow/10 via-background to-background" />
      }
    >
      <PageContainer className="space-y-5">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Profile
        </Link>

        <header className="space-y-2">
          <StoryTitle as="h1">Memory Book</StoryTitle>
          <p className="text-body-sm text-muted-foreground">
            A journal of your firsts along the climb.
          </p>
        </header>

        <GlassPanel variant="header" className="p-4">
          <p className="font-story text-heading-6 text-trail-glow">{totalFirsts} firsts</p>
          <p className="text-caption text-muted-foreground">
            Milestones worth remembering — not streaks worth stressing over.
          </p>
        </GlassPanel>

        <section aria-labelledby="memory-entries-heading" className="space-y-3">
          <h2 id="memory-entries-heading" className="sr-only">
            Memory book entries
          </h2>
          <ul className="space-y-3">
            {entries.map((entry) => (
              <li key={entry.id}>
                <MemoryBookEntry entry={entry} />
              </li>
            ))}
          </ul>
        </section>

        <PrimaryClimbButton asChild>
          <Link href="/learn">Continue climbing</Link>
        </PrimaryClimbButton>
      </PageContainer>
    </IllustratedScreen>
  );
}
