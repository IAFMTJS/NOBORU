import { trialService } from "@/features/trials/services/trial.service";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

export async function getTrialHub() {
  const userId = await requireAuthenticatedUserId();
  const [trials, performance] = await Promise.all([
    trialService.listTrials(userId),
    trialService.getPerformance(userId),
  ]);
  return { trials, performance };
}

export async function getTrialSession(slug: string) {
  const userId = await requireAuthenticatedUserId();
  return trialService.getTrialSession(userId, slug);
}
