import { deriveKanaRomaji } from "@/features/learning/utils/kana-romaji";

/** Word-level romaji for vocabulary recall — derived from kana, not example sentences. */
export function resolveVocabularyLessonRomaji(kana: string): string | null {
  const romaji = deriveKanaRomaji(kana);
  return romaji || null;
}
