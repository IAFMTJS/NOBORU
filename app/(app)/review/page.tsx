import { ReviewSessionLoader } from "@/features/review/components/review-session-loader";
import { reviewServerService } from "@/features/review/services/review-server.service";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

export default async function ReviewPage() {
  const userId = await requireAuthenticatedUserId();
  const session = await reviewServerService.getSession(userId);
  return <ReviewSessionLoader userId={userId} initialSession={session} />;
}
