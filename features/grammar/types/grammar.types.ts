import type { ContentStatus, JlptLevel } from "@/lib/content/types";

export type GrammarExampleRow = {
  id: string;
  grammar_id: string;
  japanese_text: string;
  romaji: string | null;
  english: string;
  order_index: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type GrammarExample = {
  japaneseText: string;
  romaji: string | null;
  english: string;
};

export type GrammarListEntry = {
  id: string;
  title: string;
  meaning: string;
  learned: boolean;
};

export type GrammarListViewModel = {
  entries: GrammarListEntry[];
  learnedCount: number;
  totalCount: number;
  progressPercent: number;
};

export type GrammarDetailViewModel = {
  id: string;
  title: string;
  meaning: string;
  explanation: string | null;
  jlptLevel: JlptLevel | null;
  examples: GrammarExample[];
  learned: boolean;
};

export type GrammarRow = {
  id: string;
  title: string;
  meaning: string;
  explanation: string | null;
  jlpt_level: JlptLevel | null;
  difficulty: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type GrammarInput = {
  title: string;
  meaning: string;
  explanation?: string | null;
  jlptLevel?: JlptLevel | null;
  difficulty?: number;
  status?: ContentStatus;
};
