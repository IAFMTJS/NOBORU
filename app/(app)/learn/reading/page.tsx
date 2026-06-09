import { ReadingHub } from "@/features/reading/components/reading-hub";
import { getReadingHub } from "@/lib/orchestration/learn.orchestrator";

export default async function ReadingHubPage() {
  const hub = await getReadingHub();
  return <ReadingHub hub={hub} />;
}
