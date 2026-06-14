export type MemoryBookEntryViewModel = {
  id: string;
  title: string;
  description: string;
  occurredAt: string;
  category: "lesson" | "kanji" | "region" | "social" | "milestone";
  iconLabel: string;
};

export type MemoryBookViewModel = {
  entries: MemoryBookEntryViewModel[];
  totalFirsts: number;
};
