import { TrialHub } from "@/features/trials/components/trial-hub";
import { getTrialHub } from "@/lib/orchestration/trials.orchestrator";

export default async function TrialsPage() {
  const { trials, performance } = await getTrialHub();
  return <TrialHub trials={trials} performance={performance} />;
}
