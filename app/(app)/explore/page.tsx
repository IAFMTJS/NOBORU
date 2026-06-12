import { ExploreScreen } from "@/features/explore/components/explore-screen";
import { yamaService } from "@/features/yama/services/yama.service";
import { getGameAvailability } from "@/lib/orchestration/games.orchestrator";

export default async function ExplorePage() {
  const gameAvailability = await getGameAvailability();
  const yama = yamaService.resolveExplorePresence();
  return <ExploreScreen gameAvailability={gameAvailability} yama={yama} />;
}
