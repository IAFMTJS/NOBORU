import { RegionUnitsScreen } from "@/features/learning/components/region-units-screen";
import { getRegionPath } from "@/lib/orchestration/learn.orchestrator";

type RegionPageProps = {
  params: Promise<{ regionSlug: string }>;
};

export default async function RegionPage({ params }: RegionPageProps) {
  const { regionSlug } = await params;
  const region = await getRegionPath(regionSlug);
  return <RegionUnitsScreen region={region} />;
}
