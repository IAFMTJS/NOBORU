import { JourneyScreen } from "@/features/journey/components/journey-screen";
import { getJourneyPathWithContext } from "@/lib/orchestration/learn.orchestrator";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

export default async function LearnPage() {
  await requireAuthenticatedUserId();
  const { journey, profileStats, companionEvolutionSlug } =
    await getJourneyPathWithContext();

  return (
    <JourneyScreen
      journey={journey}
      profileStats={profileStats}
      companionEvolutionSlug={companionEvolutionSlug}
    />
  );
}
