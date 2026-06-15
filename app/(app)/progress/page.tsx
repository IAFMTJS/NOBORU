import { ProgressDashboard } from "@/features/progress/components/progress-dashboard";
import { getProgressDashboard } from "@/lib/orchestration/progress.orchestrator";

export default async function ProgressPage() {
  const dashboard = await getProgressDashboard();

  return <ProgressDashboard dashboard={dashboard} />;
}
