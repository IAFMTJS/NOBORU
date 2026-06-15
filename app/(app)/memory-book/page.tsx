import { MemoryBookScreen } from "@/features/memory-book/components/memory-book-screen";
import { memoryBookService } from "@/features/memory-book/services/memory-book.service";

/** Doc 12 Screen 18 — memory book entry from camp hotspot. */
export default function MemoryBookPage() {
  const memoryBook = memoryBookService.getMemoryBook();
  return <MemoryBookScreen memoryBook={memoryBook} />;
}
