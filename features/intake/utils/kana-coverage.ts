const HIRAGANA_RANGE = /[\u3040-\u309f]/g;
const KATAKANA_RANGE = /[\u30a0-\u30ff]/g;

export function extractKanaCharacters(text: string | null | undefined): string[] {
  if (!text) return [];
  const matches = text.match(new RegExp(`${HIRAGANA_RANGE.source}|${KATAKANA_RANGE.source}`, "g"));
  return matches ? Array.from(new Set(matches)) : [];
}

export function countUnknownKana(
  text: string | null | undefined,
  knownCharacters: Set<string>,
): number {
  return extractKanaCharacters(text).filter((char) => !knownCharacters.has(char)).length;
}

export function isWithinKnownKanaCoverage(
  text: string | null | undefined,
  knownCharacters: Set<string>,
  maxNewKana: number,
): boolean {
  const unknown = countUnknownKana(text, knownCharacters);
  if (unknown === 0) return true;
  return unknown <= maxNewKana;
}

export function listNewKanaInText(
  text: string | null | undefined,
  knownCharacters: Set<string>,
): string[] {
  return extractKanaCharacters(text).filter((char) => !knownCharacters.has(char));
}
