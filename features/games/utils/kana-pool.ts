import type { HiraganaRow } from "@/features/hiragana/types/hiragana.types";
import type { KatakanaRow } from "@/features/katakana/types/katakana.types";

export type KanaScript = "hiragana" | "katakana";

export type KanaPool = {
  items: Array<HiraganaRow | KatakanaRow>;
  script: KanaScript;
};

export function kanaPoolMeetsMinimum(
  hiraganaCount: number,
  katakanaCount: number,
  minimum: number,
): boolean {
  return hiraganaCount >= minimum || katakanaCount >= minimum;
}

export function resolveKanaPool(
  hiragana: HiraganaRow[],
  katakana: KatakanaRow[],
): KanaPool | null {
  const useHiragana = hiragana.length >= katakana.length;
  const items = useHiragana ? hiragana : katakana;
  if (items.length === 0) return null;

  return {
    items,
    script: useHiragana ? "hiragana" : "katakana",
  };
}
