import { RegionUnitsScreen } from "@/features/learning/components/region-units-screen";
import { trialService } from "@/features/trials/services/trial.service";
import { getRegionPath } from "@/lib/orchestration/learn.orchestrator";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

type RegionPageProps = {
  params: Promise<{ regionSlug: string }>;
};

export default async function RegionPage({ params }: RegionPageProps) {
  const { regionSlug } = await params;
  const userId = await requireAuthenticatedUserId();
  const [region, trials] = await Promise.all([
    getRegionPath(regionSlug),
    trialService.listTrials(userId),
  ]);
  return <RegionUnitsScreen region={region} trials={trials} />;
}
