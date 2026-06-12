import { notFound } from "next/navigation";

import { MemoryDungeonPlayer } from "@/features/games/components/memory-dungeon-player";
import { GAME_SLUGS } from "@/features/games/constants/game.constants";
import { getGameSession } from "@/lib/orchestration/games.orchestrator";

export default async function MemoryDungeonPage() {
  try {
    const session = await getGameSession(GAME_SLUGS.memoryDungeon);
    if (session.slug !== GAME_SLUGS.memoryDungeon) notFound();
    return <MemoryDungeonPlayer session={session} />;
  } catch {
    notFound();
  }
}
