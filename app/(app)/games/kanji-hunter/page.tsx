import { notFound } from "next/navigation";

import { KanjiHunterPlayer } from "@/features/games/components/kanji-hunter-player";
import { GAME_SLUGS } from "@/features/games/constants/game.constants";
import { getGameSession } from "@/lib/orchestration/games.orchestrator";

export default async function KanjiHunterPage() {
  try {
    const session = await getGameSession(GAME_SLUGS.kanjiHunter);
    if (session.slug !== GAME_SLUGS.kanjiHunter) notFound();
    return <KanjiHunterPlayer session={session} />;
  } catch {
    notFound();
  }
}
