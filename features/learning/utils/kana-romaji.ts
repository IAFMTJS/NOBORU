import { toRomaji } from "wanakana";

/** Hepburn romaji derived from hiragana or katakana (word-level, not sentence). */
export function deriveKanaRomaji(kana: string): string {
  const trimmed = kana.trim();
  if (!trimmed) return "";
  return toRomaji(trimmed).trim().toLowerCase();
}
