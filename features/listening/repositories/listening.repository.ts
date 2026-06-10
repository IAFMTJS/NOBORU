import { createClient } from "@/lib/supabase/server";

import type {
  ListeningChallengeItemRow,
  ListeningChallengeRow,
  ListeningExerciseRow,
  ListeningProgressRow,
} from "@/features/listening/types/listening.types";

function normalizeOptions(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

function mapExerciseRow(
  row: Omit<ListeningExerciseRow, "options"> & { options: unknown },
): ListeningExerciseRow {
  return {
    ...row,
    options: normalizeOptions(row.options),
  };
}

class ListeningRepository {
  async listPublishedExercises(): Promise<ListeningExerciseRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listening_exercises")
      .select("*")
      .eq("status", "published")
      .order("title");

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapExerciseRow(row as ListeningExerciseRow));
  }

  async listPublishedExercisesByJlpt(
    jlptLevel: "n5" | "n4",
  ): Promise<ListeningExerciseRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listening_exercises")
      .select("*")
      .eq("status", "published")
      .eq("jlpt_level", jlptLevel)
      .order("title");

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapExerciseRow(row as ListeningExerciseRow));
  }

  async findExerciseBySlug(slug: string): Promise<ListeningExerciseRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listening_exercises")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;
    return mapExerciseRow(data as ListeningExerciseRow);
  }

  async findExerciseById(id: string): Promise<ListeningExerciseRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listening_exercises")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;
    return mapExerciseRow(data as ListeningExerciseRow);
  }

  async listPublishedChallenges(): Promise<ListeningChallengeRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listening_challenges")
      .select("*")
      .eq("status", "published")
      .order("title");

    if (error) throw new Error(error.message);
    return (data ?? []) as ListeningChallengeRow[];
  }

  async listPublishedChallengesByJlpt(
    jlptLevel: "n5" | "n4",
  ): Promise<ListeningChallengeRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listening_challenges")
      .select("*")
      .eq("status", "published")
      .eq("jlpt_level", jlptLevel)
      .order("title");

    if (error) throw new Error(error.message);
    return (data ?? []) as ListeningChallengeRow[];
  }

  async findChallengeBySlug(slug: string): Promise<ListeningChallengeRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listening_challenges")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as ListeningChallengeRow | null) ?? null;
  }

  async findChallengeById(id: string): Promise<ListeningChallengeRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listening_challenges")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as ListeningChallengeRow | null) ?? null;
  }

  async listChallengeItems(challengeId: string): Promise<ListeningChallengeItemRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listening_challenge_items")
      .select("*")
      .eq("challenge_id", challengeId)
      .order("order_index");

    if (error) throw new Error(error.message);
    return (data ?? []) as ListeningChallengeItemRow[];
  }

  async listAllChallengeItems(): Promise<ListeningChallengeItemRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listening_challenge_items")
      .select("challenge_id, exercise_id, order_index")
      .order("order_index");

    if (error) throw new Error(error.message);
    return (data ?? []) as ListeningChallengeItemRow[];
  }

  async listExercisesByIds(ids: string[]): Promise<ListeningExerciseRow[]> {
    if (ids.length === 0) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listening_exercises")
      .select("*")
      .in("id", ids)
      .eq("status", "published");

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapExerciseRow(row as ListeningExerciseRow));
  }

  async listProgressByUserId(userId: string): Promise<ListeningProgressRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listening_progress")
      .select("*")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return (data ?? []) as ListeningProgressRow[];
  }

  async findProgress(
    userId: string,
    contentType: "exercise" | "challenge",
    contentId: string,
  ): Promise<ListeningProgressRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listening_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("content_type", contentType)
      .eq("content_id", contentId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as ListeningProgressRow | null) ?? null;
  }

  async upsertProgress(input: {
    userId: string;
    contentType: "exercise" | "challenge";
    contentId: string;
    status: ListeningProgressRow["status"];
    score: number;
  }): Promise<ListeningProgressRow> {
    const supabase = await createClient();
    const completedAt =
      input.status === "completed" ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from("listening_progress")
      .upsert(
        {
          user_id: input.userId,
          content_type: input.contentType,
          content_id: input.contentId,
          status: input.status,
          score: input.score,
          completed_at: completedAt,
        },
        { onConflict: "user_id,content_type,content_id" },
      )
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ListeningProgressRow;
  }
}

export const listeningRepository = new ListeningRepository();
