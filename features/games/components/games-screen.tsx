import { GameCard } from "@/features/games/components/game-card";
import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import {
  GAME_CATALOG_ENTRIES,
  type GameCatalogId,
  UPCOMING_GAME_ENTRIES,
} from "@/features/games/constants/game.constants";
import type { GameAvailabilityViewModel } from "@/features/games/types/game.types";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";

type GamesScreenProps = {
  availability: GameAvailabilityViewModel;
};

function getEntryAvailability(
  availability: GameAvailabilityViewModel,
  catalogId: GameCatalogId,
) {
  switch (catalogId) {
    case "wordMatch":
      return availability.wordMatch;
    case "vocabularyRush":
      return availability.vocabularyRush;
    case "kanjiHunter":
      return availability.kanjiHunter;
    case "memoryDungeon":
      return availability.memoryDungeon;
  }
}

function hasPlayableGame(availability: GameAvailabilityViewModel): boolean {
  return GAME_CATALOG_ENTRIES.some(
    (entry) => getEntryAvailability(availability, entry.id).available,
  );
}

export function GamesScreen({ availability }: GamesScreenProps) {
  if (!hasPlayableGame(availability)) {
    return (
      <StudyHubLayout
        title="Games"
        subtitle="Quick sprints that reinforce what you've learned"
      >
        <YamaEmptyState
          surface="trail"
          title="Games unlock after your first lesson"
          description="Complete a lesson on the trail to build your practice pool — kana match is available early if vocabulary is still small."
          actionHref="/tree"
          actionLabel="Continue on trail"
        />
      </StudyHubLayout>
    );
  }

  return (
    <StudyHubLayout
      title="Games"
      subtitle="Quick sprints that reinforce what you've learned"
    >
      <div className="space-y-3">
        {GAME_CATALOG_ENTRIES.map((entry) => {
          const entryAvailability = getEntryAvailability(availability, entry.id);
          const available = entryAvailability.available;

          let badge: string | undefined;
          let description: string = entry.description;

          if (
            entry.id === "wordMatch" &&
            available &&
            availability.wordMatch.mode === "kana"
          ) {
            badge = "Kana Match";
            description = "Match hiragana or katakana to romaji.";
          }

          return (
            <GameCard
              key={entry.slug}
              href={`/games/${entry.slug}`}
              title={entry.title}
              description={description}
              gameSlug={entry.slug}
              disabled={!available}
              badge={badge}
            />
          );
        })}

        {UPCOMING_GAME_ENTRIES.map((entry) => (
          <GameCard
            key={entry.slug}
            href="#"
            title={entry.title}
            description={entry.description}
            gameSlug={entry.slug}
            disabled
          />
        ))}
      </div>
    </StudyHubLayout>
  );
}
