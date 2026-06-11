import { notFound } from "next/navigation";

import { WordMatchPlayer } from "@/features/games/components/word-match-player";
import { GAME_SLUGS } from "@/features/games/constants/game.constants";
import { getGameSession } from "@/lib/orchestration/games.orchestrator";

export default async function WordMatchPage() {
  try {
    const session = await getGameSession(GAME_SLUGS.wordMatch);
    if (session.slug !== GAME_SLUGS.wordMatch) notFound();
    return <WordMatchPlayer session={session} />;
  } catch {
    notFound();
  }
}
