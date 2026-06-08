import { ReviewSession } from "@/features/review/components/review-session";
import { reviewService } from "@/features/review/services/review.service";

export default async function ReviewPage() {
  const card = await reviewService.getCurrentCard();
  return <ReviewSession card={card} />;
}
