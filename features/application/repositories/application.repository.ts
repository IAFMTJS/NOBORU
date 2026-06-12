import { createClient } from "@/lib/supabase/server";

import type { ApplicationExerciseRow } from "@/features/application/types/application.types";

function normalizeAcceptedAnswers(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

class ApplicationRepository {
  async findById(id: string): Promise<ApplicationExerciseRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("application_exercises")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
      ...(data as Omit<ApplicationExerciseRow, "accepted_answers">),
      accepted_answers: normalizeAcceptedAnswers(
        (data as { accepted_answers: unknown }).accepted_answers,
      ),
    };
  }

  async findByIds(ids: string[]): Promise<ApplicationExerciseRow[]> {
    if (ids.length === 0) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("application_exercises")
      .select("*")
      .in("id", ids);

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      ...(row as Omit<ApplicationExerciseRow, "accepted_answers">),
      accepted_answers: normalizeAcceptedAnswers(
        (row as { accepted_answers: unknown }).accepted_answers,
      ),
    }));
  }
}

export const applicationRepository = new ApplicationRepository();
