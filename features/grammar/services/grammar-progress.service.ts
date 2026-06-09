import { grammarRepository } from "@/features/grammar/repositories/grammar.repository";
import type {
  GrammarDetailViewModel,
  GrammarListViewModel,
} from "@/features/grammar/types/grammar.types";

class GrammarProgressService {
  async getN5List(userId: string): Promise<GrammarListViewModel> {
    const [points, learnedIds] = await Promise.all([
      grammarRepository.listPublishedByJlpt("n5"),
      grammarRepository.listLearnedGrammarIds(userId),
    ]);

    const learnedSet = new Set(learnedIds);
    const entries = points.map((point) => ({
      id: point.id,
      title: point.title,
      meaning: point.meaning,
      learned: learnedSet.has(point.id),
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

  async getGrammarDetail(
    userId: string,
    grammarId: string,
  ): Promise<GrammarDetailViewModel | null> {
    const [point, learnedIds, examples] = await Promise.all([
      grammarRepository.findById(grammarId),
      grammarRepository.listLearnedGrammarIds(userId),
      grammarRepository.listPublishedExamplesByGrammarId(grammarId),
    ]);

    if (!point || point.status !== "published") {
      return null;
    }

    return {
      id: point.id,
      title: point.title,
      meaning: point.meaning,
      explanation: point.explanation,
      jlptLevel: point.jlpt_level,
      examples: examples.map((example) => ({
        japaneseText: example.japanese_text,
        romaji: example.romaji,
        english: example.english,
      })),
      learned: learnedIds.includes(point.id),
    };
  }
}

export const grammarProgressService = new GrammarProgressService();
