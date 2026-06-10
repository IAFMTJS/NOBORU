import { isContentStatus, isJlptLevel } from "@/lib/content/types";
import type { PaginatedResult, PaginationOptions } from "@/lib/api/pagination";
import { kanjiRepository } from "@/features/kanji/repositories/kanji.repository";
import type {
  KanjiInput,
  KanjiRow,
  KanjiWithReadings,
} from "@/features/kanji/types/kanji.types";

function validate(input: KanjiInput): string | null {
  if (!input.character.trim()) return "Kanji character is required.";
  if (!input.meaning.trim()) return "Meaning is required.";
  if (input.jlptLevel && !isJlptLevel(input.jlptLevel)) {
    return "Invalid JLPT level.";
  }
  if (input.status && !isContentStatus(input.status)) {
    return "Invalid status.";
  }
  return null;
}

class KanjiAdminService {
  list(pagination: PaginationOptions = {}): Promise<PaginatedResult<KanjiRow>> {
    return kanjiRepository.list(pagination);
  }

  getById(id: string): Promise<KanjiWithReadings | null> {
    return kanjiRepository.findById(id);
  }

  async create(input: KanjiInput): Promise<KanjiRow> {
    const error = validate(input);
    if (error) throw new Error(error);
    return kanjiRepository.create(input);
  }

  async update(id: string, input: KanjiInput): Promise<KanjiRow> {
    const error = validate(input);
    if (error) throw new Error(error);
    return kanjiRepository.update(id, input);
  }

  remove(id: string): Promise<void> {
    return kanjiRepository.remove(id);
  }
}

export const kanjiAdminService = new KanjiAdminService();
