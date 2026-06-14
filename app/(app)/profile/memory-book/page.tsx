import { MemoryBookScreen } from "@/features/memory-book/components/memory-book-screen";
import { memoryBookService } from "@/features/memory-book/services/memory-book.service";

export default function MemoryBookPage() {
  const memoryBook = memoryBookService.getMemoryBook();
  return <MemoryBookScreen memoryBook={memoryBook} />;
}
