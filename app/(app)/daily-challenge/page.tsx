import { DailyChallengeScreen } from "@/features/daily-challenges/components/daily-challenge-screen";
import { dailyChallengeService } from "@/features/daily-challenges/services/daily-challenge.service";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

export default async function DailyChallengePage() {
  const userId = await requireAuthenticatedUserId();
  const session = await dailyChallengeService.getRetentionSession(userId);

  return <DailyChallengeScreen session={session} />;
}
