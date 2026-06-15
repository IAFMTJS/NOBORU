import { notFound } from "next/navigation";

import { DiscoverArticleScreen } from "@/features/discover/components/discover-article-screen";
import {
  getDiscoverArticle,
  getDiscoverCategory,
} from "@/features/discover/constants/discover-content";
import type { DiscoverCategorySlug } from "@/features/discover/types/discover.types";

type PageProps = {
  params: Promise<{ category: string; articleId: string }>;
};

export default async function DiscoverArticlePage({ params }: PageProps) {
  const { category, articleId } = await params;
  const meta = getDiscoverCategory(category);

  if (!meta) {
    notFound();
  }

  const article = getDiscoverArticle(meta.slug as DiscoverCategorySlug, articleId);
  if (!article) {
    notFound();
  }

  return (
    <DiscoverArticleScreen
      categorySlug={meta.slug as DiscoverCategorySlug}
      articleId={articleId}
    />
  );
}
