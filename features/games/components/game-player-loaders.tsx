"use client";

import dynamic from "next/dynamic";

function GamePlayerSkeleton() {
  return (
    <div
      className="min-h-content animate-pulse bg-muted motion-reduce:animate-none"
      aria-hidden
    />
  );
}

export const KanjiHunterPlayer = dynamic(
  () =>
    import("@/features/games/components/kanji-hunter-player").then(
      (module) => module.KanjiHunterPlayer,
    ),
  { loading: () => <GamePlayerSkeleton /> },
);

export const WordMatchPlayer = dynamic(
  () =>
    import("@/features/games/components/word-match-player").then(
      (module) => module.WordMatchPlayer,
    ),
  { loading: () => <GamePlayerSkeleton /> },
);

export const MemoryDungeonPlayer = dynamic(
  () =>
    import("@/features/games/components/memory-dungeon-player").then(
      (module) => module.MemoryDungeonPlayer,
    ),
  { loading: () => <GamePlayerSkeleton /> },
);

export const VocabularyRushPlayer = dynamic(
  () =>
    import("@/features/games/components/vocabulary-rush-player").then(
      (module) => module.VocabularyRushPlayer,
    ),
  { loading: () => <GamePlayerSkeleton /> },
);
