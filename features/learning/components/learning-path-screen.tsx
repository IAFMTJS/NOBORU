import { TrailFirstLearnScreen } from "@/features/learning/components/trail-first-learn-screen";
import type { LearningPathViewModel } from "@/features/learning/types/lesson.types";

type LearningPathScreenProps = {
  path: LearningPathViewModel;
  initialRegionSlug: string;
};

/** @deprecated Use TrailFirstLearnScreen directly. Kept for compatibility. */
export function LearningPathScreen({
  path,
  initialRegionSlug,
}: LearningPathScreenProps) {
  return <TrailFirstLearnScreen path={path} initialRegionSlug={initialRegionSlug} />;
}
