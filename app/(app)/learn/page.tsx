import { TrailFirstLearnScreen } from "@/features/learning/components/trail-first-learn-screen";
import { getLearningPathWithContext } from "@/lib/orchestration/learn.orchestrator";

export default async function LearnPage() {
  const { path, currentRegionSlug } = await getLearningPathWithContext();
  return <TrailFirstLearnScreen path={path} initialRegionSlug={currentRegionSlug} />;
}
