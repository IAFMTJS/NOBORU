import { toRomaji } from "wanakana";

/** Hepburn romaji derived from hiragana or katakana (word-level, not sentence). */
export function deriveKanaRomaji(kana: string): string {
  const trimmed = kana.trim();
  if (!trimmed) return "";
  const romaji = toRomaji(trimmed).trim().toLowerCase();
  if (!romaji || /[\u3040-\u30ff\u4e00-\u9fff]/.test(romaji)) return "";
  return romaji;
}

/** Romaji for full Japanese sentences or clauses. */
export function deriveSentenceRomaji(japanese: string): string {
  const trimmed = japanese.trim();
  if (!trimmed) return "";
  const romaji = toRomaji(trimmed).trim().toLowerCase();
  if (!romaji || /[\u3040-\u30ff\u4e00-\u9fff]/.test(romaji)) return "";
  return romaji;
}

function isLatinDisplayText(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return /^[a-zA-Z\s\-'’.ōūāēīôûêâîäëïöüàèìòù.,!?;:()]+$/.test(trimmed);
}

/** Romaji for application/listening prompts from Japanese text or accepted latin answers. */
export function resolveJapaneseDisplayRomaji(
  japanese: string | null | undefined,
  acceptedAnswers: string[] = [],
): string | null {
  if (japanese) {
    const fromJapanese = deriveSentenceRomaji(japanese);
    if (fromJapanese) return fromJapanese;
  }

  const latinAnswers = acceptedAnswers.filter((answer) => isLatinDisplayText(answer));
  const sentenceLike = latinAnswers.find((answer) => answer.includes(" "));
  if (sentenceLike) return sentenceLike.trim().toLowerCase();

  const wordLike = latinAnswers.find((answer) => answer.trim().length > 0);
  return wordLike?.trim().toLowerCase() ?? null;
}
