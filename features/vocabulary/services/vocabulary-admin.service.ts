import { isContentStatus, isJlptLevel } from "@/lib/content/types";
import {
  mapVocabularyInputToRow,
  vocabularyRepository,
} from "@/features/vocabulary/repositories/vocabulary.repository";
import type {
  VocabularyInput,
  VocabularyListFilters,
  VocabularyRow,
} from "@/features/vocabulary/types/vocabulary.types";

function validateInput(input: VocabularyInput): string | null {
  if (!input.kana.trim()) {
    return "Kana is required.";
  }

  if (!input.meaning.trim()) {
    return "Meaning is required.";
  }

  if (input.jlptLevel && !isJlptLevel(input.jlptLevel)) {
    return "Invalid JLPT level.";
  }

  if (input.status && !isContentStatus(input.status)) {
    return "Invalid content status.";
  }

  return null;
}

class VocabularyAdminService {
  list(filters: VocabularyListFilters = {}): Promise<VocabularyRow[]> {
    return vocabularyRepository.list(filters);
  }

  getById(id: string): Promise<VocabularyRow | null> {
    return vocabularyRepository.findById(id);
  }

  async create(input: VocabularyInput): Promise<VocabularyRow> {
    const error = validateInput(input);
    if (error) {
      throw new Error(error);
    }

    return vocabularyRepository.create(mapVocabularyInputToRow(input));
  }

  async update(id: string, input: VocabularyInput): Promise<VocabularyRow> {
    const error = validateInput(input);
    if (error) {
      throw new Error(error);
    }

    return vocabularyRepository.update(id, mapVocabularyInputToRow(input));
  }

  remove(id: string): Promise<void> {
    return vocabularyRepository.remove(id);
  }
}

export const vocabularyAdminService = new VocabularyAdminService();
