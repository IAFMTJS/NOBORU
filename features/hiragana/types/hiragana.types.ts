import type { ContentStatus } from "@/lib/content/types";

export type HiraganaRow = {
  id: string;
  character: string;
  romaji: string;
  row_name: string;
  row_label: string;
  order_index: number;
  variant_type: "base" | "dakuten" | "handakuten" | "combo";
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type HiraganaChartEntry = {
  id: string;
  character: string;
  romaji: string;
  rowName: string;
  rowLabel: string;
  variantType: HiraganaRow["variant_type"];
  learned: boolean;
};

export type HiraganaChartViewModel = {
  entries: HiraganaChartEntry[];
  learnedCount: number;
  totalCount: number;
  progressPercent: number;
};
