import {
  calculateKanjiHunterEp,
  calculateMemoryDungeonEp,
  calculateVocabularyRushEp,
  calculateWordMatchEp,
  GAME_SLUGS,
  MIN_GAME_POOL_SIZE,
  type PlayableGameSlug,
} from "@/features/games/constants/game.constants";
import { gameContentRepository } from "@/features/games/repositories/game-content.repository";
import { reinforcementTargetIds } from "@/lib/learning/reinforcement.service";
import { validateGoldenContentRule } from "@/lib/learning/golden-content.validator";
import { playerKnowledgeService } from "@/features/learning/services/player-knowledge.service";
import { buildKanjiHunterSession } from "@/features/games/services/kanji-hunter.service";
import {
  buildMemoryDungeonSession,
  canBuildMemoryDungeon,
} from "@/features/games/services/memory-dungeon.service";
import { buildVocabularyRushSession } from "@/features/games/services/vocabulary-rush.service";
import {
  buildWordMatchSession,
  resolveWordMatchMode,
} from "@/features/games/services/word-match.service";
import type {
  GameAvailabilityViewModel,
  GameCompleteInput,
  GameCompleteViewModel,
  GameSessionViewModel,
} from "@/features/games/types/game.types";
import { achievementService } from "@/features/achievements/services/achievement.service";
import { elevationService } from "@/features/elevation/services/elevation.service";
import { questService } from "@/features/quests/services/quest.service";

type GameSessionOptions = {
  weakOnly?: boolean;
};

class GameService {
  async getAvailability(userId: string): Promise<GameAvailabilityViewModel> {
    const unlocked = await gameContentRepository.hasUnlockedGames(userId);
    if (!unlocked) {
      return {
        wordMatch: { available: false, mode: null, poolSize: 0 },
        vocabularyRush: { available: false, poolSize: 0 },
        kanjiHunter: { available: false, poolSize: 0 },
        memoryDungeon: { available: false, poolSize: 0, roomCount: 0 },
      };
    }

    const [vocabulary, hiragana, katakana, kanji] = await Promise.all([
      gameContentRepository.listLearnedVocabulary(userId),
      gameContentRepository.listLearnedHiragana(userId),
      gameContentRepository.listLearnedKatakana(userId),
      gameContentRepository.listLearnedKanji(userId),
    ]);

    const wordMatchMode = resolveWordMatchMode(
      vocabulary.length,
      hiragana.length,
      katakana.length,
    );
    const wordMatchPool =
      wordMatchMode === "vocabulary"
        ? vocabulary.length
        : Math.max(hiragana.length, katakana.length);

    return {
      wordMatch: {
        available: wordMatchMode !== null,
        mode: wordMatchMode,
        poolSize: wordMatchPool,
      },
      vocabularyRush: {
        available: vocabulary.length >= MIN_GAME_POOL_SIZE,
        poolSize: vocabulary.length,
      },
      kanjiHunter: {
        available: kanji.length >= MIN_GAME_POOL_SIZE,
        poolSize: kanji.length,
      },
      memoryDungeon: (() => {
        if (!canBuildMemoryDungeon(vocabulary.length, kanji.length)) {
          return { available: false, poolSize: 0, roomCount: 0 };
        }
        try {
          const preview = buildMemoryDungeonSession({ vocabulary, kanji });
          return {
            available: true,
            poolSize: preview.totalPairs,
            roomCount: preview.roomCount,
          };
        } catch {
          return { available: false, poolSize: 0, roomCount: 0 };
        }
      })(),
    };
  }

  async getSession(
    userId: string,
    slug: PlayableGameSlug,
    options: GameSessionOptions = {},
  ): Promise<GameSessionViewModel> {
    const unlocked = await gameContentRepository.hasUnlockedGames(userId);
    if (!unlocked) {
      throw new Error("Complete your first lesson to unlock games.");
    }

    const [vocabulary, weakVocabulary, hiragana, katakana, kanji] =
      await Promise.all([
        gameContentRepository.listLearnedVocabulary(userId),
        gameContentRepository.listWeakLearnedVocabulary(userId),
        gameContentRepository.listLearnedHiragana(userId),
        gameContentRepository.listLearnedKatakana(userId),
        gameContentRepository.listLearnedKanji(userId),
      ]);

    const playerContext = await playerKnowledgeService.getGlobalContext(userId);
    if (playerContext) {
      const reinforcementIds = reinforcementTargetIds(playerContext, 20);
      const knownSet = new Set(playerContext.knownVocabularyIds);
      const validation = validateGoldenContentRule(reinforcementIds, knownSet);
      if (!validation.valid) {
        throw new Error("Game content violates the golden content rule.");
      }
    }

    if (slug === GAME_SLUGS.wordMatch) {
      const mode = resolveWordMatchMode(
        vocabulary.length,
        hiragana.length,
        katakana.length,
      );
      if (!mode) {
        throw new Error(
          "Learn more on the trail to unlock matching practice.",
        );
      }
      return buildWordMatchSession({
        mode,
        vocabulary,
        hiragana,
        katakana,
      });
    }

    if (slug === GAME_SLUGS.vocabularyRush) {
      const pool =
        options.weakOnly && weakVocabulary.length >= MIN_GAME_POOL_SIZE
          ? weakVocabulary
          : vocabulary;
      return buildVocabularyRushSession(pool);
    }

    if (slug === GAME_SLUGS.kanjiHunter) {
      return buildKanjiHunterSession(kanji);
    }

    if (slug === GAME_SLUGS.memoryDungeon) {
      return buildMemoryDungeonSession({ vocabulary, kanji });
    }

    throw new Error("Unknown game.");
  }

  async completeGame(
    userId: string,
    slug: PlayableGameSlug,
    input: GameCompleteInput,
  ): Promise<GameCompleteViewModel> {
    if (input.totalCount <= 0) {
      throw new Error("Invalid game result.");
    }

    const accuracyPercent = Math.round(
      (input.correctCount / input.totalCount) * 100,
    );

    const epAmount =
      slug === GAME_SLUGS.wordMatch
        ? calculateWordMatchEp(input.wrongAttempts ?? 0)
        : slug === GAME_SLUGS.memoryDungeon
          ? calculateMemoryDungeonEp(input.wrongAttempts ?? 0)
          : slug === GAME_SLUGS.kanjiHunter
            ? calculateKanjiHunterEp(accuracyPercent)
            : calculateVocabularyRushEp(accuracyPercent);

    const description =
      slug === GAME_SLUGS.wordMatch
        ? "Word Match complete"
        : slug === GAME_SLUGS.memoryDungeon
          ? "Memory Dungeon complete"
          : slug === GAME_SLUGS.kanjiHunter
            ? "Kanji Hunter complete"
            : "Vocabulary Rush complete";

    const elevation = await elevationService.awardEp({
      userId,
      sourceType: "game",
      sourceId: slug,
      amount: epAmount,
      description,
    });

    const [, quests] = await Promise.all([
      achievementService.afterStudyActivity(userId),
      questService.recordActivities(userId, [
        ...(elevation
          ? [{ type: "ep_earned" as const, amount: elevation.epAwarded }]
          : []),
      ]),
    ]);

    return {
      slug,
      accuracyPercent,
      epAwarded: epAmount,
      elevation,
      quests,
    };
  }
}

export const gameService = new GameService();
