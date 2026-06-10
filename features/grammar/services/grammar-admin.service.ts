import { isContentStatus, isJlptLevel } from "@/lib/content/types";
import type { PaginatedResult, PaginationOptions } from "@/lib/api/pagination";
import { grammarRepository } from "@/features/grammar/repositories/grammar.repository";
import type { GrammarInput, GrammarRow } from "@/features/grammar/types/grammar.types";

function validate(input: GrammarInput): string | null {
  if (!input.title.trim()) return "Title is required.";
  if (!input.meaning.trim()) return "Meaning is required.";
  if (input.jlptLevel && !isJlptLevel(input.jlptLevel)) {
    return "Invalid JLPT level.";
  }
  if (input.status && !isContentStatus(input.status)) {
    return "Invalid status.";
  }
  return null;
}

class GrammarAdminService {
  list(pagination: PaginationOptions = {}): Promise<PaginatedResult<GrammarRow>> {
    return grammarRepository.list(pagination);
  }

  getById(id: string): Promise<GrammarRow | null> {
    return grammarRepository.findById(id);
  }

  async create(input: GrammarInput): Promise<GrammarRow> {
    const error = validate(input);
    if (error) throw new Error(error);
    return grammarRepository.create(input);
  }

  async update(id: string, input: GrammarInput): Promise<GrammarRow> {
    const error = validate(input);
    if (error) throw new Error(error);
    return grammarRepository.update(id, input);
  }

  remove(id: string): Promise<void> {
    return grammarRepository.remove(id);
  }
}

export const grammarAdminService = new GrammarAdminService();
