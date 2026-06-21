export const GAME_SLUGS = {
  wordMatch: "word-match",
  vocabularyRush: "vocabulary-rush",
  kanjiHunter: "kanji-hunter",
  memoryDungeon: "memory-dungeon",
  readingChallenge: "reading-challenge",
} as const;

export type GameSlug = (typeof GAME_SLUGS)[keyof typeof GAME_SLUGS];

export const PLAYABLE_GAME_SLUGS = [
  GAME_SLUGS.wordMatch,
  GAME_SLUGS.vocabularyRush,
  GAME_SLUGS.kanjiHunter,
  GAME_SLUGS.memoryDungeon,
] as const;

export type PlayableGameSlug = (typeof PLAYABLE_GAME_SLUGS)[number];

export function isPlayableGameSlug(value: string): value is PlayableGameSlug {
  return (PLAYABLE_GAME_SLUGS as readonly string[]).includes(value);
}

export const MIN_GAME_POOL_SIZE = 4;
export const GAME_VOCABULARY_POOL_LIMIT = 100;

export const WORD_MATCH_PAIR_COUNT = 6;
export const KANA_MATCH_PAIR_COUNT = 8;

export const VOCABULARY_RUSH_QUESTION_COUNT = 10;
export const VOCABULARY_RUSH_LIVES = 3;
export const RUSH_TIMER_START_SECONDS = 12;
export const RUSH_TIMER_MIN_SECONDS = 6;
export const RUSH_TIMER_STREAK_BONUS_SECONDS = 1;

export const WORD_MATCH_EP = {
  perfect: 20,
  good: 15,
  pass: 10,
} as const;

export const VOCABULARY_RUSH_EP = {
  excellent: 25,
  good: 18,
  pass: 12,
  participation: 10,
} as const;

export function calculateWordMatchEp(wrongAttempts: number): number {
  if (wrongAttempts === 0) return WORD_MATCH_EP.perfect;
  if (wrongAttempts <= 2) return WORD_MATCH_EP.good;
  return WORD_MATCH_EP.pass;
}

export function calculateVocabularyRushEp(accuracyPercent: number): number {
  if (accuracyPercent >= 90) return VOCABULARY_RUSH_EP.excellent;
  if (accuracyPercent >= 70) return VOCABULARY_RUSH_EP.good;
  if (accuracyPercent >= 50) return VOCABULARY_RUSH_EP.pass;
  return VOCABULARY_RUSH_EP.participation;
}

export const KANJI_HUNTER_QUESTION_COUNT = 10;
export const KANJI_HUNTER_LIVES = 3;

export const KANJI_HUNTER_EP = VOCABULARY_RUSH_EP;

export function calculateKanjiHunterEp(accuracyPercent: number): number {
  return calculateVocabularyRushEp(accuracyPercent);
}

export const MEMORY_DUNGEON_ROOM1_PAIRS = 6;
export const MEMORY_DUNGEON_ROOM2_PAIRS = 4;
export const MEMORY_DUNGEON_ROOM3_PAIRS = 4;

export const MEMORY_DUNGEON_EP = {
  perfect: 22,
  good: 17,
  pass: 12,
} as const;

export function calculateMemoryDungeonEp(wrongAttempts: number): number {
  if (wrongAttempts === 0) return MEMORY_DUNGEON_EP.perfect;
  if (wrongAttempts <= 3) return MEMORY_DUNGEON_EP.good;
  return MEMORY_DUNGEON_EP.pass;
}

export const GAME_CATALOG_ENTRIES = [
  {
    id: "wordMatch",
    slug: GAME_SLUGS.wordMatch,
    title: "Word Match",
    description: "Match Japanese words to their English meanings.",
  },
  {
    id: "vocabularyRush",
    slug: GAME_SLUGS.vocabularyRush,
    title: "Vocabulary Rush",
    description: "Fast recall — pick the right meaning before time runs out.",
  },
  {
    id: "kanjiHunter",
    slug: GAME_SLUGS.kanjiHunter,
    title: "Kanji Hunter",
    description: "Recognize kanji meanings and readings under pressure.",
  },
  {
    id: "memoryDungeon",
    slug: GAME_SLUGS.memoryDungeon,
    title: "Memory Dungeon",
    description: "Clear rooms of memory pairs to strengthen long-term retention.",
  },
] as const;

export type GameCatalogId = (typeof GAME_CATALOG_ENTRIES)[number]["id"];

export const UPCOMING_GAME_ENTRIES = [
  {
    slug: GAME_SLUGS.readingChallenge,
    title: "Reading Challenge",
    description: "Graded reading passages with comprehension checks.",
  },
] as const;
