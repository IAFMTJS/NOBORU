import { GlassPanel } from "@/components/visual";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";
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
    <SecondaryScreenShell
      title={article.title}
      subtitle={article.japaneseTitle ?? article.summary}
      backHref={`/world/discover/${categorySlug}`}
      backLabel={category.label}
      contentClassName="pb-2"
    >
      <div className="mx-auto max-w-md space-y-3">
        {article.sections.map((section, index) => (
          <GlassPanel key={`${article.id}-${index}`} className="space-y-2 p-4">
            {section.heading ? (
              <h2 className="font-sans text-body font-semibold">{section.heading}</h2>
            ) : null}
            <p className="text-body-sm leading-relaxed text-foreground/90">{section.body}</p>
          </GlassPanel>
        ))}
      </div>
    </SecondaryScreenShell>
  );
}
