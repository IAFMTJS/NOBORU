import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import {
  GlassPanel,
  IllustratedScreen,
  StoryTitle,
} from "@/components/visual";
import { SceneImage } from "@/components/media/scene-image";
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
      scrim="minimal"
      background={
        <SceneImage
          scene="world_map_peaks"
          alt=""
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      <PageContainer>
        <ScreenHeader
          variant="story"
          title={category.label}
          subtitle={category.tagline}
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/world">Back</Link>
            </Button>
          }
        />

        <div className="space-y-3">
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
      </PageContainer>
    </IllustratedScreen>
  );
}

export function DiscoverJapanIndex() {
  return (
    <IllustratedScreen
      scrim="minimal"
      background={
        <SceneImage
          scene="world_map_peaks"
          alt=""
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      <PageContainer>
        <ScreenHeader
          variant="story"
          title="Discover Japan"
          subtitle="Culture, folklore, and lore along the climb."
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/world">Back</Link>
            </Button>
          }
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DISCOVER_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/world/discover/${category.slug}`}
              className="focus-ring flex flex-col items-center gap-2 rounded-xl border border-glass-border bg-glass-bg/50 px-3 py-4 text-center transition-colors hover:border-trail-glow/40"
            >
              <span className="font-japanese text-lg text-primary" aria-hidden>
                {category.glyph}
              </span>
              <span className="text-body-sm font-medium">{category.label}</span>
            </Link>
          ))}
        </div>
      </PageContainer>
    </IllustratedScreen>
  );
}
