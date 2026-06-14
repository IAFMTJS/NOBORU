import { JourneyScreen } from "@/features/journey/components/journey-screen";
import { getJourneyPathWithContext } from "@/lib/orchestration/learn.orchestrator";
import { getCompanionSummary } from "@/lib/orchestration/companion.orchestrator";
import { settingsServerService } from "@/features/settings/services/settings-server.service";
import { trialService } from "@/features/trials/services/trial.service";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const userId = await requireAuthenticatedUserId();
  const { region: regionQuery } = await searchParams;
  const [{ journey, currentRegionSlug }, trials, companion, settings] =
    await Promise.all([
      getJourneyPathWithContext(),
      trialService.listTrials(userId),
      getCompanionSummary(userId),
      settingsServerService.getSettings(),
    ]);

  return (
    <JourneyScreen
      journey={journey}
      initialRegionSlug={regionQuery ?? currentRegionSlug}
      trials={trials}
      companionEvolutionSlug={companion.evolutionSlug}
      soundEnabled={settings?.soundEnabled ?? true}
    />
  );
}
