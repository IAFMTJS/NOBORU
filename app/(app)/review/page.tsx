import { ReviewSessionLoader } from "@/features/review/components/review-session-loader";
import { reviewServerService } from "@/features/review/services/review-server.service";
import type { ReviewContentType } from "@/features/review/types/review.types";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

type ReviewPageProps = {
  searchParams: Promise<{
    limit?: string;
    contentType?: string;
    weakOnly?: string;
  }>;
};

const REVIEW_CONTENT_TYPES = new Set<ReviewContentType>([
  "hiragana",
  "katakana",
  "vocabulary",
  "kanji",
  "grammar",
]);

function parseSessionLimit(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.min(parsed, 25);
}

function parseContentType(value: string | undefined): ReviewContentType | null {
  if (!value) return null;
  return REVIEW_CONTENT_TYPES.has(value as ReviewContentType)
    ? (value as ReviewContentType)
    : null;
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { limit: limitParam, contentType: contentTypeParam, weakOnly } =
    await searchParams;
  const sessionLimit = parseSessionLimit(limitParam);
  const contentType = parseContentType(contentTypeParam);
  const session = await reviewServerService.getSession(userId);
  return (
    <ReviewSessionLoader
      userId={userId}
      initialSession={session}
      sessionLimit={sessionLimit}
      contentType={contentType}
      weakOnly={weakOnly === "true"}
    />
  );
}
