import type { MemoryBookViewModel } from "@/features/memory-book/types/memory-book.types";

/** Returns empty until live memory-book repository is wired (see feature-flags). */
class MemoryBookService {
  getMemoryBook(): MemoryBookViewModel {
    return { totalFirsts: 0, entries: [] };
  }
}

export const memoryBookService = new MemoryBookService();
