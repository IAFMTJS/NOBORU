import type { ContentStatus, JlptLevel } from "@/lib/content/types";

export type KanjiExampleRow = {
  id: string;
  kanji_id: string;
  japanese_text: string;
  romaji: string | null;
  english: string;
  order_index: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type KanjiExample = {
  japaneseText: string;
  romaji: string | null;
  english: string;
};

export type KanjiListEntry = {
  id: string;
  character: string;
  meaning: string;
  strokeCount: number | null;
  learned: boolean;
};

export type KanjiListViewModel = {
  entries: KanjiListEntry[];
  learnedCount: number;
  totalCount: number;
  progressPercent: number;
};

export type KanjiDetailViewModel = {
  id: string;
  character: string;
  meaning: string;
  jlptLevel: JlptLevel | null;
  strokeCount: number | null;
  onyomi: string[];
  kunyomi: string[];
  examples: KanjiExample[];
  learned: boolean;
};

export type KanjiRow = {
  id: string;
  character: string;
  meaning: string;
  jlpt_level: JlptLevel | null;
  grade_level: number | null;
  frequency_rank: number | null;
  stroke_count: number | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type KanjiReadingRow = {
  id: string;
  kanji_id: string;
  reading: string;
  reading_type: "onyomi" | "kunyomi";
};

export type KanjiInput = {
  character: string;
  meaning: string;
  jlptLevel?: JlptLevel | null;
  gradeLevel?: number | null;
  frequencyRank?: number | null;
  strokeCount?: number | null;
  onyomi?: string;
  kunyomi?: string;
  status?: ContentStatus;
};

export type KanjiWithReadings = KanjiRow & {
  readings: KanjiReadingRow[];
};
