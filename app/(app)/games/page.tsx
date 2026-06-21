import { GamesScreen } from "@/features/games/components/games-screen";
import { getGameAvailability } from "@/lib/orchestration/games.orchestrator";

export default async function GamesPage() {
  const availability = await getGameAvailability();
  return <GamesScreen availability={availability} />;
}
