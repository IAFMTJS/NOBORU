import { createClient } from "@/lib/supabase/server";

import { reviewRepository } from "@/features/review/repositories/review.repository";
import type { SaveIntakeInput } from "@/features/intake/types/intake.types";

class IntakeRepository {
  async saveKnownContent(userId: string, input: SaveIntakeInput): Promise<number> {
    const items = [
      ...input.hiraganaIds.map((contentId) => ({
        contentType: "hiragana",
        contentId,
      })),
      ...input.katakanaIds.map((contentId) => ({
        contentType: "katakana",
        contentId,
      })),
      ...input.vocabularyIds.map((contentId) => ({
        contentType: "vocabulary",
        contentId,
      })),
    ];

    await reviewRepository.seedKnownItemsBatch(userId, items);

    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ knowledge_intake_completed_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    return items.length;
  }
}

export const intakeRepository = new IntakeRepository();
