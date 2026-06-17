import { createClient } from "@/lib/supabase/server";

export type UserDailyChallengeCompletionRow = {
  id: string;
  user_id: string;
  challenge_date: string;
  correct_count: number;
  total_count: number;
  vocabulary_ids: string[];
  client_event_id: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
};

class DailyChallengeRepository {
  async findByDate(
    userId: string,
    challengeDate: string,
  ): Promise<UserDailyChallengeCompletionRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_daily_challenge_completions")
      .select("*")
      .eq("user_id", userId)
      .eq("challenge_date", challengeDate)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as UserDailyChallengeCompletionRow) ?? null;
  }

  async findByClientEventId(
    userId: string,
    clientEventId: string,
  ): Promise<UserDailyChallengeCompletionRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_daily_challenge_completions")
      .select("*")
      .eq("user_id", userId)
      .eq("client_event_id", clientEventId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as UserDailyChallengeCompletionRow) ?? null;
  }

  async insertCompletion(input: {
    userId: string;
    challengeDate: string;
    correctCount: number;
    totalCount: number;
    vocabularyIds: string[];
    clientEventId?: string;
    completedAt?: string;
  }): Promise<UserDailyChallengeCompletionRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_daily_challenge_completions")
      .insert({
        user_id: input.userId,
        challenge_date: input.challengeDate,
        correct_count: input.correctCount,
        total_count: input.totalCount,
        vocabulary_ids: input.vocabularyIds,
        client_event_id: input.clientEventId ?? null,
        completed_at: input.completedAt ?? new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserDailyChallengeCompletionRow;
  }
}

export const dailyChallengeRepository = new DailyChallengeRepository();
