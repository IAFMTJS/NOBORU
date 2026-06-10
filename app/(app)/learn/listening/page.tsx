import { ListeningHub } from "@/features/listening/components/listening-hub";
import {
  getListeningHub,
  resolveJlptLevel,
} from "@/lib/orchestration/learn.orchestrator";

type ListeningHubPageProps = {
  searchParams: Promise<{ jlpt?: string }>;
};

export default async function ListeningHubPage({
  searchParams,
}: ListeningHubPageProps) {
  const params = await searchParams;
  const jlptLevel = resolveJlptLevel(params.jlpt);
  const hub = await getListeningHub(jlptLevel);
  return <ListeningHub hub={hub} jlptLevel={jlptLevel} />;
}
