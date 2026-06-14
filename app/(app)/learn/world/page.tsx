import { WorldMapScreen } from "@/features/world-map/components/world-map-screen";
import { buildWorldMapViewModel } from "@/features/world-map/services/world-map.service";
import { getJourneyPath } from "@/lib/orchestration/learn.orchestrator";

export default async function WorldMapPage() {
  const journey = await getJourneyPath();
  const data = buildWorldMapViewModel(journey);

  return <WorldMapScreen data={data} />;
}
