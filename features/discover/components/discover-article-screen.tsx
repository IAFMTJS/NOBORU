import Link from "next/link";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { SceneImage } from "@/components/media/scene-image";
import { GlassPanel, IllustratedScreen, StoryTitle } from "@/components/visual";
import {
  getDiscoverArticle,
  getDiscoverCategory,
} from "@/features/discover/constants/discover-content";
import type { DiscoverCategorySlug } from "@/features/discover/types/discover.types";

type DiscoverArticleScreenProps = {
  categorySlug: DiscoverCategorySlug;
  articleId: string;
};

export function DiscoverArticleScreen({
  categorySlug,
  articleId,
}: DiscoverArticleScreenProps) {
  const category = getDiscoverCategory(categorySlug);
  const article = getDiscoverArticle(categorySlug, articleId);

  if (!category || !article) {
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
            href={`/world/discover/${categorySlug}`}
            className="inline-flex items-center gap-1.5 text-body-sm text-white/70 transition-colors hover:text-white"
          >
            <UiIconImage name="arrow_left" size={16} />
            {category.label}
          </Link>

          <GlassPanel variant="header" className="space-y-2 rounded-card p-4">
            <StoryTitle as="h1" className="text-xl">
              {article.title}
            </StoryTitle>
            {article.japaneseTitle ? (
              <p className="font-japanese text-body text-primary">{article.japaneseTitle}</p>
            ) : null}
            <p className="text-body-sm text-muted-foreground">{article.summary}</p>
          </GlassPanel>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-2 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-md space-y-3">
            {article.sections.map((section, index) => (
              <GlassPanel key={`${article.id}-${index}`} className="space-y-2 p-4">
                {section.heading ? (
                  <StoryTitle as="h2" className="text-sm">
                    {section.heading}
                  </StoryTitle>
                ) : null}
                <p className="text-body-sm leading-relaxed text-foreground/90">
                  {section.body}
                </p>
              </GlassPanel>
            ))}
          </div>
        </main>
      </div>
    </IllustratedScreen>
  );
}
