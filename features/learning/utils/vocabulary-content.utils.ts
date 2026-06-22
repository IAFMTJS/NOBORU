/** Word-level romaji lives on examples until vocabulary rows store it directly. */
export function resolveVocabularyLessonRomaji(
  examples: ReadonlyArray<{ romaji: string | null }>,
): string | null {
  return examples.find((example) => example.romaji)?.romaji ?? null;
}
