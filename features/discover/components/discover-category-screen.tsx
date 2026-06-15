import Link from "next/link";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { SceneImage } from "@/components/media/scene-image";
import { GlassPanel, IllustratedScreen, StoryTitle } from "@/components/visual";
import {
  DISCOVER_CATEGORIES,
  getDiscoverArticles,
  getDiscoverCategory,
} from "@/features/discover/constants/discover-content";
import type { DiscoverCategorySlug } from "@/features/discover/types/discover.types";

type DiscoverCategoryScreenProps = {
  categorySlug: DiscoverCategorySlug;
};

export function DiscoverCategoryScreen({ categorySlug }: DiscoverCategoryScreenProps) {
  const category = getDiscoverCategory(categorySlug);
  const articles = getDiscoverArticles(categorySlug);

  if (!category) {
    return null;
  }

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
            href="/world"
            className="inline-flex items-center gap-1.5 text-body-sm text-white/70 transition-colors hover:text-white"
          >
            <UiIconImage name="arrow_left" size={16} />
            Discover
          </Link>

          <GlassPanel variant="header" className="space-y-1 rounded-card p-3">
            <StoryTitle as="h1" className="text-base">
              {category.label}
            </StoryTitle>
            <p className="text-caption text-muted-foreground">{category.tagline}</p>
          </GlassPanel>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-2 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-md space-y-3">
            {articles.map((article) => (
              <GlassPanel key={article.id} className="p-4">
                <Link
                  href={`/world/discover/${categorySlug}/${article.id}`}
                  className="focus-ring block space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <StoryTitle as="h2" className="text-base">
                      {article.title}
                    </StoryTitle>
                    <span className="shrink-0 text-caption text-muted-foreground">
                      {article.readMinutes} min
                    </span>
                  </div>
                  {article.japaneseTitle ? (
                    <p className="font-japanese text-body-sm text-primary">
                      {article.japaneseTitle}
                    </p>
                  ) : null}
                  <p className="text-body-sm text-muted-foreground">{article.summary}</p>
                  <p className="text-caption font-medium text-primary">Read →</p>
                </Link>
              </GlassPanel>
            ))}
          </div>
        </main>
      </div>
    </IllustratedScreen>
  );
}

export function DiscoverJapanIndex() {
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

          <GlassPanel variant="header" className="space-y-1 rounded-card p-3">
            <StoryTitle as="h1" className="text-base">
              Discover Japan
            </StoryTitle>
            <p className="text-caption text-muted-foreground">
              Culture, folklore, and lore along the climb.
            </p>
          </GlassPanel>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-2 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-md grid grid-cols-2 gap-2 sm:grid-cols-3">
            {DISCOVER_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/world/discover/${category.slug}`}
                className="focus-ring flex flex-col items-center gap-2 rounded-xl border border-glass-border bg-black/35 px-3 py-4 text-center backdrop-blur-sm transition-colors hover:border-trail-glow/40"
              >
                <span className="font-japanese text-lg text-primary" aria-hidden>
                  {category.glyph}
                </span>
                <span className="text-body-sm font-medium text-white">{category.label}</span>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </IllustratedScreen>
  );
}
