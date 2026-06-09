import { LearningPathScreen } from "@/features/learning/components/learning-path-screen";
import { getLearningPath } from "@/lib/orchestration/learn.orchestrator";

export default async function LearnPage() {
  const path = await getLearningPath();
  return <LearningPathScreen path={path} />;
}
