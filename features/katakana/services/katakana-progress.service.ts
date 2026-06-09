import { katakanaRepository } from "@/features/katakana/repositories/katakana.repository";
import type { KatakanaChartViewModel } from "@/features/katakana/types/katakana.types";

class KatakanaProgressService {
  async getChart(userId: string): Promise<KatakanaChartViewModel> {
    const [characters, learnedIds] = await Promise.all([
      katakanaRepository.listPublished(),
      katakanaRepository.listLearnedKatakanaIds(userId),
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

export const katakanaProgressService = new KatakanaProgressService();
