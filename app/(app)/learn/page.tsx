import { TrailFirstLearnScreen } from "@/features/learning/components/trail-first-learn-screen";
import { getLearningPathWithContext } from "@/lib/orchestration/learn.orchestrator";
import { trialService } from "@/features/trials/services/trial.service";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const userId = await requireAuthenticatedUserId();
  const { region: regionQuery } = await searchParams;
  const { path, currentRegionSlug } = await getLearningPathWithContext();
  const trials = await trialService.listTrials(userId);

  return (
    <TrailFirstLearnScreen
      path={path}
      initialRegionSlug={regionQuery ?? currentRegionSlug}
      trials={trials}
    />
  );
}
