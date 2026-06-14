"use client";

import Link from "next/link";

import { RegionHeroImage } from "@/components/media/region-hero-image";
import { PageContainer } from "@/components/layout/page-container";
import { GlassPanel, IllustratedScreen, StoryTitle } from "@/components/visual";
import { YamaTrainingPresence } from "@/features/yama/components/yama-training-presence";

const TRAINING_GROUNDS = [
  {
    title: "Review Queue",
    description: "Spaced repetition and weakness drills.",
    href: "/review",
    glyph: "◎",
    location: "vocabulary_hall" as const,
  },
  {
    title: "Kana Dojo",
    description: "Hiragana and katakana recognition and writing.",
    href: "/learn/hiragana",
    glyph: "あ",
    location: "kana_dojo" as const,
  },
  {
    title: "Vocabulary Hall",
    description: "Word recall, meaning, and production drills.",
    href: "/learn/vocabulary",
    glyph: "語",
    location: "vocabulary_hall" as const,
  },
  {
    title: "Grammar Shrine",
    description: "Pattern recognition and sentence building.",
    href: "/learn/grammar",
    glyph: "寺",
    location: "grammar_shrine" as const,
  },
  {
    title: "Listening Pavilion",
    description: "Ear training and comprehension practice.",
    href: "/learn/listening",
    glyph: "♪",
    location: "listening_pavilion" as const,
  },
  {
    title: "Kanji Grounds",
    description: "Readings, radicals, and stroke mastery.",
    href: "/learn/kanji",
    glyph: "字",
    location: "grammar_shrine" as const,
  },
  {
    title: "Reading Library",
    description: "Graded passages and comprehension checks.",
    href: "/learn/reading",
    glyph: "巻",
    location: "grammar_shrine" as const,
  },
] as const;

function DojoHubTile({
  glyph,
  title,
  description,
  href,
}: {
  glyph: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <GlassPanel className="transition-colors hover:border-trail-glow/30">
      <Link href={href} className="focus-ring block space-y-3 p-4">
        <div className="flex items-start gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-success/10 font-japanese text-lg text-success"
            aria-hidden
          >
            {glyph}
          </span>
          <div className="min-w-0 space-y-1">
            <p className="text-body-sm font-semibold">{title}</p>
            <p className="text-caption text-muted-foreground">{description}</p>
          </div>
        </div>
        <p className="text-caption font-medium text-primary">Enter →</p>
      </Link>
    </GlassPanel>
  );
}

export function DojoScreen() {
  return (
    <IllustratedScreen
      scrim="minimal"
      background={
        <RegionHeroImage
          regionSlug="forest-trail"
          alt=""
          className="absolute inset-0 h-full min-h-dvh rounded-none"
          hideOverlay
        />
      }
    >
      <PageContainer>
        <header className="space-y-1">
          <StoryTitle as="h1" className="text-xl">
            Dojo
          </StoryTitle>
          <p className="text-body-sm text-muted-foreground">
            Training Grounds — deliberate practice for mastery
          </p>
        </header>

        <GlassPanel className="p-4">
          <YamaTrainingPresence location="kana_dojo" size="md" className="mb-0" />
        </GlassPanel>

        <div className="grid gap-3 sm:grid-cols-2">
          {TRAINING_GROUNDS.map((ground) => (
            <DojoHubTile
              key={ground.href}
              glyph={ground.glyph}
              title={ground.title}
              description={ground.description}
              href={ground.href}
            />
          ))}
        </div>
      </PageContainer>
    </IllustratedScreen>
  );
}
