"use client";

import Link from "next/link";
import Image from "next/image";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import {
  GlassPanel,
  IllustratedScreen,
  PrimaryClimbButton,
  StoryTitle,
} from "@/components/visual";
import { DISCOVER_CATEGORIES } from "@/features/discover/constants/discover-content";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
import { getWorldIconPath } from "@/lib/assets/registry";

const DISCOVER_CATEGORIES_TILES = DISCOVER_CATEGORIES.map((category) => ({
  label: category.label,
  glyph: category.glyph,
  iconSlug: category.iconSlug,
  href: `/world/discover/${category.slug}`,
}));

type ExploreScreenProps = {
  yama: YamaPresenceViewModel;
};

function DiscoverCategoryTile({
  label,
  glyph,
  iconSlug,
  href,
}: {
  label: string;
  glyph: string;
  iconSlug: string;
  href: string;
}) {
  const src = getWorldIconPath(iconSlug);
  return (
    <Link
      href={href}
      className="focus-ring flex flex-col items-center gap-2 rounded-xl border border-glass-border bg-black/35 px-3 py-4 text-center backdrop-blur-sm transition-colors hover:border-trail-glow/40"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-glass-border bg-primary/10">
        {src ? (
          <Image src={src} alt="" width={28} height={28} aria-hidden className="object-contain" />
        ) : (
          <span className="font-japanese text-lg text-primary" aria-hidden>
            {glyph}
          </span>
        )}
      </span>
      <span className="text-body-sm font-medium text-white">{label}</span>
      <span className="text-caption text-trail-glow">Read</span>
    </Link>
  );
}

/** Secondary discovery — lore and culture along the climb; not a primary hub. */
export function ExploreScreen({ yama }: ExploreScreenProps) {
  return (
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="world_map_peaks"
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
            href="/learn"
            className="inline-flex items-center gap-1.5 text-body-sm text-white/70 transition-colors hover:text-white"
          >
            <UiIconImage name="arrow_left" size={16} />
            Journey
          </Link>

          <GlassPanel variant="header" className="space-y-3 rounded-card p-4">
            <div className="space-y-1">
              <StoryTitle as="h1" className="text-base">
                Discover Japan
              </StoryTitle>
              <p className="text-caption text-muted-foreground">
                Culture, folklore, and lore between lessons on the trail
              </p>
            </div>
            <YamaPresence
              presence={yama}
              size="sm"
              layout="horizontal"
              bubbleClassName="border-glass-border bg-glass-bg/80"
            />
          </GlassPanel>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-2">
          <div className="mx-auto max-w-md space-y-4 pb-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DISCOVER_CATEGORIES_TILES.map((cat) => (
                <DiscoverCategoryTile
                  key={cat.label}
                  label={cat.label}
                  glyph={cat.glyph}
                  iconSlug={cat.iconSlug}
                  href={cat.href}
                />
              ))}
            </div>

            <GlassPanel className="space-y-2 p-4">
              <div className="space-y-1">
                <StoryTitle as="h2" className="text-sm">
                  Mountain overview
                </StoryTitle>
                <p className="text-caption text-muted-foreground">
                  Optional map view — the main climb stays on the Journey trail.
                </p>
              </div>
              <Link
                href="/learn/world"
                className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                <UiIconImage name="map" size={14} />
                Open world map
              </Link>
            </GlassPanel>
          </div>
        </main>

        <footer className="relative z-10 shrink-0 p-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-2">
          <PrimaryClimbButton asChild className="mx-auto max-w-md">
            <Link href="/learn">Return to trail</Link>
          </PrimaryClimbButton>
        </footer>
      </div>
    </IllustratedScreen>
  );
}
