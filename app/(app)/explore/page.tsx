import { ExploreScreen } from "@/features/explore/components/explore-screen";
import { getGameAvailability } from "@/lib/orchestration/games.orchestrator";

export default async function ExplorePage() {
  const gameAvailability = await getGameAvailability();
  return <ExploreScreen gameAvailability={gameAvailability} />;
}
