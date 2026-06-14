import type { MemoryBookViewModel } from "@/features/memory-book/types/memory-book.types";

const PLACEHOLDER_MEMORY_BOOK: MemoryBookViewModel = {
  totalFirsts: 5,
  entries: [
    {
      id: "first-lesson",
      title: "First Lesson Complete",
      description: "You finished your very first step on the Foothills trail.",
      occurredAt: "2026-03-12T14:30:00.000Z",
      category: "lesson",
      iconLabel: "📖",
    },
    {
      id: "first-kanji",
      title: "First Kanji Mastered",
      description: "山 — mountain. A fitting start for a climber.",
      occurredAt: "2026-03-18T09:15:00.000Z",
      category: "kanji",
      iconLabel: "字",
    },
    {
      id: "first-region",
      title: "First Region Cleared",
      description: "The Foothills welcomed you through to Forest Trail.",
      occurredAt: "2026-04-02T18:00:00.000Z",
      category: "region",
      iconLabel: "⛰️",
    },
    {
      id: "first-friend",
      title: "First Friend Followed",
      description: "You started climbing alongside another learner.",
      occurredAt: "2026-04-20T11:45:00.000Z",
      category: "social",
      iconLabel: "🤝",
    },
    {
      id: "first-streak-week",
      title: "First Week of Climbing",
      description: "Seven days of steady ascent — no guilt, just progress.",
      occurredAt: "2026-05-01T08:00:00.000Z",
      category: "milestone",
      iconLabel: "🔥",
    },
  ],
};

class MemoryBookService {
  getMemoryBook(): MemoryBookViewModel {
    return PLACEHOLDER_MEMORY_BOOK;
  }
}

export const memoryBookService = new MemoryBookService();
