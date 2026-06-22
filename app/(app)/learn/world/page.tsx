import { WorldMapScreen } from "@/features/world-map/components/world-map-screen";
import { getWorldMapViewModel } from "@/lib/orchestration/learn.orchestrator";

export default async function WorldMapPage() {
  const data = await getWorldMapViewModel();

  return <WorldMapScreen data={data} />;
}
