import type { VocabularyLifecycleStage } from "@/lib/learning/learning-architecture.constants";
import type { DifficultyProfile } from "@/lib/learning/difficulty-scaling.service";

export type DrillDifficultyProps = {
  lifecycleStage?: VocabularyLifecycleStage;
  difficultyProfile?: DifficultyProfile;
};
