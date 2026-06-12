import {
  GAME_SLUGS,
  MEMORY_DUNGEON_ROOM1_PAIRS,
  MEMORY_DUNGEON_ROOM2_PAIRS,
  MEMORY_DUNGEON_ROOM3_PAIRS,
  MIN_GAME_POOL_SIZE,
} from "@/features/games/constants/game.constants";
import type {
  MemoryDungeonPair,
  MemoryDungeonRoom,
} from "@/features/games/types/game.types";
import { shuffle } from "@/features/games/utils/shuffle";
import type { KanjiRow } from "@/features/kanji/types/kanji.types";
import type { VocabularyRow } from "@/features/vocabulary/types/vocabulary.types";

function formatVocabularyPrompt(word: VocabularyRow): string {
  return word.kanji?.trim() || word.kana;
}

function buildVocabularyPairs(
  words: VocabularyRow[],
  count: number,
  prefix: string,
): MemoryDungeonPair[] {
  return shuffle(words)
    .slice(0, count)
    .map((word) => ({
      pairId: `${prefix}-${word.id}`,
      faceA: formatVocabularyPrompt(word),
      faceB: word.meaning,
    }));
}

function buildKanjiPairs(kanji: KanjiRow[], count: number): MemoryDungeonPair[] {
  return shuffle(kanji)
    .slice(0, count)
    .map((entry) => ({
      pairId: `kanji-${entry.id}`,
      faceA: entry.character,
      faceB: entry.meaning,
    }));
}

export function canBuildMemoryDungeon(
  vocabularyCount: number,
  kanjiCount: number,
): boolean {
  return (
    vocabularyCount >= MIN_GAME_POOL_SIZE ||
    kanjiCount >= MIN_GAME_POOL_SIZE
  );
}

export function buildMemoryDungeonSession(input: {
  vocabulary: VocabularyRow[];
  kanji: KanjiRow[];
}) {
  const rooms: MemoryDungeonRoom[] = [];
  const usedVocabIds = new Set<string>();
  const usedKanjiIds = new Set<string>();

  if (input.vocabulary.length >= MEMORY_DUNGEON_ROOM1_PAIRS) {
    const roomWords = shuffle(input.vocabulary).slice(0, MEMORY_DUNGEON_ROOM1_PAIRS);
    roomWords.forEach((word) => usedVocabIds.add(word.id));
    rooms.push({
      id: "vocab-vault",
      title: "Vocabulary Vault",
      description: "Match Japanese words to their English meanings.",
      pairs: roomWords.map((word) => ({
        pairId: `vault-${word.id}`,
        faceA: formatVocabularyPrompt(word),
        faceB: word.meaning,
      })),
    });
  } else if (input.vocabulary.length >= MIN_GAME_POOL_SIZE) {
    const roomWords = shuffle(input.vocabulary).slice(0, MIN_GAME_POOL_SIZE);
    roomWords.forEach((word) => usedVocabIds.add(word.id));
    rooms.push({
      id: "vocab-vault",
      title: "Vocabulary Vault",
      description: "Match Japanese words to their English meanings.",
      pairs: buildVocabularyPairs(roomWords, roomWords.length, "vault"),
    });
  }

  if (input.kanji.length >= MEMORY_DUNGEON_ROOM2_PAIRS) {
    const roomKanji = shuffle(input.kanji)
      .filter((entry) => !usedKanjiIds.has(entry.id))
      .slice(0, MEMORY_DUNGEON_ROOM2_PAIRS);
    roomKanji.forEach((entry) => usedKanjiIds.add(entry.id));
    if (roomKanji.length >= MIN_GAME_POOL_SIZE) {
      rooms.push({
        id: "kanji-chamber",
        title: "Kanji Chamber",
        description: "Match kanji characters to their meanings.",
        pairs: buildKanjiPairs(roomKanji, roomKanji.length),
      });
    }
  }

  const remainingVocab = input.vocabulary.filter((word) => !usedVocabIds.has(word.id));
  if (remainingVocab.length >= MEMORY_DUNGEON_ROOM3_PAIRS) {
    const roomWords = shuffle(remainingVocab).slice(0, MEMORY_DUNGEON_ROOM3_PAIRS);
    rooms.push({
      id: "summit-cache",
      title: "Summit Cache",
      description: "One last vocabulary room before you exit the dungeon.",
      pairs: buildVocabularyPairs(roomWords, roomWords.length, "summit"),
    });
  } else if (remainingVocab.length >= MIN_GAME_POOL_SIZE && rooms.length < 2) {
    const roomWords = shuffle(remainingVocab).slice(0, MIN_GAME_POOL_SIZE);
    rooms.push({
      id: "summit-cache",
      title: "Summit Cache",
      description: "Match the remaining vocabulary pairs to escape.",
      pairs: buildVocabularyPairs(roomWords, roomWords.length, "summit"),
    });
  }

  if (rooms.length === 0) {
    throw new Error("Learn more vocabulary or kanji to enter the Memory Dungeon.");
  }

  const totalPairs = rooms.reduce((sum, room) => sum + room.pairs.length, 0);

  return {
    slug: GAME_SLUGS.memoryDungeon,
    modeLabel: "Memory Dungeon",
    rooms,
    totalPairs,
    roomCount: rooms.length,
  };
}
