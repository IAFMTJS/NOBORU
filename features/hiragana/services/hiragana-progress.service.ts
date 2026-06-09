import { hiraganaRepository } from "@/features/hiragana/repositories/hiragana.repository";
import type { HiraganaChartViewModel } from "@/features/hiragana/types/hiragana.types";

class HiraganaProgressService {
  async getChart(userId: string): Promise<HiraganaChartViewModel> {
    const [characters, learnedIds] = await Promise.all([
      hiraganaRepository.listPublished(),
      hiraganaRepository.listLearnedHiraganaIds(userId),
    ]);

    const learnedSet = new Set(learnedIds);

    const entries = characters.map((character) => ({
      id: character.id,
      character: character.character,
      romaji: character.romaji,
      rowName: character.row_name,
      rowLabel: character.row_label,
      variantType: character.variant_type,
      learned: learnedSet.has(character.id),
    }));

    const learnedCount = entries.filter((entry) => entry.learned).length;

    return {
      entries,
      learnedCount,
      totalCount: entries.length,
      progressPercent:
        entries.length === 0
          ? 0
          : Math.round((learnedCount / entries.length) * 100),
    };
  }
}

export const hiraganaProgressService = new HiraganaProgressService();
