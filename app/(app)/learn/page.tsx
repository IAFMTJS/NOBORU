import { JourneyScreen } from "@/features/journey/components/journey-screen";
import { getJourneyPathWithContext } from "@/lib/orchestration/learn.orchestrator";
import { trialService } from "@/features/trials/services/trial.service";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const userId = await requireAuthenticatedUserId();
  const { region: regionQuery } = await searchParams;
  const [{ journey, currentRegionSlug, profileStats, companionEvolutionSlug }, trials] =
    await Promise.all([
      getJourneyPathWithContext(),
      trialService.listTrials(userId),
    ]);

  return (
    <JourneyScreen
      journey={journey}
      initialRegionSlug={regionQuery ?? currentRegionSlug}
      trials={trials}
      profileStats={profileStats}
      companionEvolutionSlug={companionEvolutionSlug}
    />
  );
}
