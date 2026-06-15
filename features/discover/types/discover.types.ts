export type DiscoverCategorySlug =
  | "culture"
  | "history"
  | "folklore"
  | "food"
  | "anime"
  | "mythology";

export type DiscoverArticle = {
  id: string;
  category: DiscoverCategorySlug;
  title: string;
  japaneseTitle?: string;
  summary: string;
  readMinutes: number;
  sections: Array<{
    heading?: string;
    body: string;
  }>;
};

export type DiscoverCategory = {
  slug: DiscoverCategorySlug;
  label: string;
  glyph: string;
  iconSlug: string;
  tagline: string;
};
