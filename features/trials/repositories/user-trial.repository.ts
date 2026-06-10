import { createClient } from "@/lib/supabase/server";

import type {
  TrialGrade,
  UserTrialAttemptRow,
  UserTrialProgressRow,
} from "@/features/trials/types/trial.types";

class UserTrialRepository {
  async listProgressByUserId(userId: string): Promise<UserTrialProgressRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_trial_progress")
      .select("*")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return (data ?? []) as UserTrialProgressRow[];
  }

  async findProgress(
    userId: string,
    trialTemplateId: string,
  ): Promise<UserTrialProgressRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_trial_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("trial_template_id", trialTemplateId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as UserTrialProgressRow | null;
  }

  async upsertProgress(input: {
    userId: string;
    trialTemplateId: string;
    bestScore: number;
    bestGrade: TrialGrade | null;
    passed: boolean;
    passedAt: string | null;
    attemptCount: number;
    lastAttemptAt: string;
  }): Promise<UserTrialProgressRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_trial_progress")
      .upsert(
        {
          user_id: input.userId,
          trial_template_id: input.trialTemplateId,
          best_score: input.bestScore,
          best_grade: input.bestGrade,
          passed: input.passed,
          passed_at: input.passedAt,
          attempt_count: input.attemptCount,
          last_attempt_at: input.lastAttemptAt,
        },
        { onConflict: "user_id,trial_template_id" },
      )
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserTrialProgressRow;
  }

  async insertAttempt(input: {
    userId: string;
    trialTemplateId: string;
    scorePercent: number;
    grade: TrialGrade | null;
    correctCount: number;
    totalCount: number;
    timeSpentSeconds: number;
    passed: boolean;
    epAwarded: number | null;
    startedAt: string;
    completedAt: string;
  }): Promise<UserTrialAttemptRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_trial_attempts")
      .insert({
        user_id: input.userId,
        trial_template_id: input.trialTemplateId,
        score_percent: input.scorePercent,
        grade: input.grade,
        correct_count: input.correctCount,
        total_count: input.totalCount,
        time_spent_seconds: input.timeSpentSeconds,
        passed: input.passed,
        ep_awarded: input.epAwarded,
        started_at: input.startedAt,
        completed_at: input.completedAt,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserTrialAttemptRow;
  }

  async listRecentAttempts(
    userId: string,
    limit = 5,
  ): Promise<Array<UserTrialAttemptRow & { trial_title?: string }>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_trial_attempts")
      .select("*, trial_templates(title)")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      ...(row as UserTrialAttemptRow),
      trial_title: (row as { trial_templates?: { title?: string } }).trial_templates
        ?.title,
    }));
  }

  async countAttempts(userId: string): Promise<number> {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("user_trial_attempts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return count ?? 0;
  }
}

export const userTrialRepository = new UserTrialRepository();
