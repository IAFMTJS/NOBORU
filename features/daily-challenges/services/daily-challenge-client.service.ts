import type {
  DailyChallengeCompleteInput,
  DailyChallengeCompleteViewModel,
} from "@/features/daily-challenges/types/daily-challenge.types";

async function parseJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as { data?: T; error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }
  return payload.data as T;
}

class DailyChallengeClientService {
  async submitReviewRating(input: {
    reviewItemId: string;
    correct: boolean;
    clientEventId: string;
  }): Promise<void> {
    const response = await fetch("/api/review/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewItemId: input.reviewItemId,
        rating: input.correct ? "good" : "again",
        clientEventId: input.clientEventId,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      throw new Error(payload.error ?? "Failed to submit review rating.");
    }
  }

  async completeSession(
    input: DailyChallengeCompleteInput,
  ): Promise<DailyChallengeCompleteViewModel> {
    const response = await fetch("/api/daily-challenges/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    return parseJson<DailyChallengeCompleteViewModel>(response);
  }
}

export const dailyChallengeClientService = new DailyChallengeClientService();
