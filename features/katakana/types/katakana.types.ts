import type { ContentStatus } from "@/lib/content/types";

export type KatakanaRow = {
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

export type KatakanaChartEntry = {
  id: string;
  character: string;
  romaji: string;
  rowName: string;
  rowLabel: string;
  variantType: KatakanaRow["variant_type"];
  learned: boolean;
};

export type KatakanaChartViewModel = {
  entries: KatakanaChartEntry[];
  learnedCount: number;
  totalCount: number;
  progressPercent: number;
};
