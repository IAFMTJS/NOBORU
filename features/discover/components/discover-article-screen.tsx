import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { GlassPanel, IllustratedScreen, StoryTitle } from "@/components/visual";
import { SceneImage } from "@/components/media/scene-image";
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
        <div className="space-y-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/world/discover/${categorySlug}`}>← {category.label}</Link>
          </Button>

          <header className="space-y-2">
            <StoryTitle as="h1" className="text-xl">
              {article.title}
            </StoryTitle>
            {article.japaneseTitle ? (
              <p className="font-japanese text-body text-primary">
                {article.japaneseTitle}
              </p>
            ) : null}
            <p className="text-body-sm text-muted-foreground">{article.summary}</p>
          </header>

          <div className="space-y-3">
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
        </div>
      </PageContainer>
    </IllustratedScreen>
  );
}
