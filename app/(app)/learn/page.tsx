import { TrailFirstLearnScreen } from "@/features/learning/components/trail-first-learn-screen";
import { getLearningPathWithContext } from "@/lib/orchestration/learn.orchestrator";
import { trialService } from "@/features/trials/services/trial.service";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

export default async function LearnPage() {
  const userId = await requireAuthenticatedUserId();
  const { path, currentRegionSlug } = await getLearningPathWithContext();
  const trials = await trialService.listTrials(userId);
  const regionTrial = trials.find(
    (t) =>
      t.regionSlug === currentRegionSlug &&
      t.availability === "available" &&
      !t.progress?.passed,
  );

  return (
    <TrailFirstLearnScreen
      path={path}
      initialRegionSlug={currentRegionSlug}
      regionTrial={
        regionTrial
          ? { href: `/trials/${regionTrial.slug}`, title: regionTrial.title }
          : null
      }
    />
  );
}
