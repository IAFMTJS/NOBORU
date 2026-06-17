import type { ContentStatus } from "@/lib/content/types";

export type VocabularyCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type VocabularyCategoryAssignmentRow = {
  id: string;
  vocabulary_id: string;
  category_id: string;
  created_at: string;
  updated_at: string;
};
