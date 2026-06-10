import type { ContentStatus, JlptLevel } from "@/lib/content/types";

export type VocabularyExampleRow = {
  id: string;
  vocabulary_id: string;
  japanese_text: string;
  romaji: string | null;
  english: string;
  order_index: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type VocabularyExample = {
  japaneseText: string;
  romaji: string | null;
  english: string;
};

export type VocabularyListEntry = {
  id: string;
  kana: string;
  kanji: string | null;
  meaning: string;
  partOfSpeech: string | null;
  learned: boolean;
};

export type VocabularyListViewModel = {
  entries: VocabularyListEntry[];
  learnedCount: number;
  totalCount: number;
  progressPercent: number;
};

export type VocabularyDetailViewModel = {
  id: string;
  kana: string;
  kanji: string | null;
  meaning: string;
  partOfSpeech: string | null;
  jlptLevel: JlptLevel | null;
  audioUrl: string | null;
  examples: VocabularyExample[];
  learned: boolean;
};

export type VocabularyRow = {
  id: string;
  kanji: string | null;
  kana: string;
  meaning: string;
  part_of_speech: string | null;
  jlpt_level: JlptLevel | null;
  frequency_rank: number | null;
  difficulty: number;
  audio_url: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type VocabularyInput = {
  kanji?: string | null;
  kana: string;
  meaning: string;
  partOfSpeech?: string | null;
  jlptLevel?: JlptLevel | null;
  frequencyRank?: number | null;
  difficulty?: number;
  audioUrl?: string | null;
  status?: ContentStatus;
};

export type VocabularyListFilters = {
  status?: ContentStatus;
  jlptLevel?: JlptLevel;
  search?: string;
  page?: number;
  limit?: number;
};
