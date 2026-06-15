import { CampScreen } from "@/features/camp/components/camp-screen";
import { getHomeDashboard } from "@/lib/orchestration/home.orchestrator";

export default async function CampPage() {
  const data = await getHomeDashboard();
  return <CampScreen data={data} />;
}
