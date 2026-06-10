import { ReadingHub } from "@/features/reading/components/reading-hub";
import {
  getReadingHub,
  resolveJlptLevel,
} from "@/lib/orchestration/learn.orchestrator";

type ReadingHubPageProps = {
  searchParams: Promise<{ jlpt?: string }>;
};

export default async function ReadingHubPage({
  searchParams,
}: ReadingHubPageProps) {
  const params = await searchParams;
  const jlptLevel = resolveJlptLevel(params.jlpt);
  const hub = await getReadingHub(jlptLevel);
  return <ReadingHub hub={hub} jlptLevel={jlptLevel} />;
}
