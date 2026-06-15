import { notFound } from "next/navigation";

import { DiscoverCategoryScreen } from "@/features/discover/components/discover-category-screen";
import { getDiscoverCategory } from "@/features/discover/constants/discover-content";
import type { DiscoverCategorySlug } from "@/features/discover/types/discover.types";

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function DiscoverCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const meta = getDiscoverCategory(category);

  if (!meta) {
    notFound();
  }

  return <DiscoverCategoryScreen categorySlug={meta.slug as DiscoverCategorySlug} />;
}
