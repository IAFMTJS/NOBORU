import { notFound } from "next/navigation";

import { VocabularyRushPlayer } from "@/features/games/components/vocabulary-rush-player";
import { GAME_SLUGS } from "@/features/games/constants/game.constants";
import { getGameSession } from "@/lib/orchestration/games.orchestrator";

type VocabularyRushPageProps = {
  searchParams: Promise<{ weakOnly?: string }>;
};

export default async function VocabularyRushPage({
  searchParams,
}: VocabularyRushPageProps) {
  const { weakOnly } = await searchParams;
  try {
    const session = await getGameSession(GAME_SLUGS.vocabularyRush, {
      weakOnly: weakOnly === "true",
    });
    if (session.slug !== GAME_SLUGS.vocabularyRush) notFound();
    return <VocabularyRushPlayer session={session} />;
  } catch {
    notFound();
  }
}
