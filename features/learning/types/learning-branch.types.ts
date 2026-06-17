import type { ContentStatus } from "@/lib/content/types";

export type LearningBranchRow = {
  id: string;
  region_id: string;
  unit_id: string | null;
  category_id: string | null;
  slug: string;
  name: string;
  description: string | null;
  order_index: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type LearningBranchWithCategory = LearningBranchRow & {
  category: {
    id: string;
    slug: string;
    name: string;
  } | null;
};
