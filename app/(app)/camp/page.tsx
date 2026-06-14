import { HomeDashboard } from "@/features/learning/components/home-dashboard";
import { getHomeDashboard } from "@/lib/orchestration/home.orchestrator";

export default async function CampPage() {
  const data = await getHomeDashboard();
  return <HomeDashboard data={data} />;
}
