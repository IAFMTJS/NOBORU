import { toRomaji } from "wanakana";

/** Hepburn romaji derived from hiragana or katakana (word-level, not sentence). */
export function deriveKanaRomaji(kana: string): string {
  const trimmed = kana.trim();
  if (!trimmed) return "";
  const romaji = toRomaji(trimmed).trim().toLowerCase();
  if (!romaji || /[\u3040-\u30ff\u4e00-\u9fff]/.test(romaji)) return "";
  return romaji;
}
