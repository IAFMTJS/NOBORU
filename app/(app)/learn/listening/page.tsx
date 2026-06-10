import { ListeningHub } from "@/features/listening/components/listening-hub";
import { getListeningHub } from "@/lib/orchestration/learn.orchestrator";

export default async function ListeningHubPage() {
  const hub = await getListeningHub();
  return <ListeningHub hub={hub} />;
}
