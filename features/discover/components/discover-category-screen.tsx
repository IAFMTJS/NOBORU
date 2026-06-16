import Link from "next/link";

import { GlassPanel } from "@/components/visual";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";
import {
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
    <SecondaryScreenShell
      title={category.label}
      subtitle={category.tagline}
      backHref="/world"
      backLabel="Discover"
      contentClassName="pb-2"
    >
      <div className="mx-auto max-w-md space-y-2">
        {articles.map((article) => (
          <Link key={article.id} href={`/world/discover/${categorySlug}/${article.id}`} className="focus-ring block">
            <GlassPanel className="p-4 transition-colors hover:bg-white/58">
              <p className="font-medium">{article.title}</p>
              <p className="mt-1 text-caption text-muted-foreground">{article.summary}</p>
            </GlassPanel>
          </Link>
        ))}
      </div>
    </SecondaryScreenShell>
  );
}
