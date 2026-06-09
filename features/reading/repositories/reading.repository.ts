import { createClient } from "@/lib/supabase/server";

import type {
  DialogueChoiceRow,
  DialogueNodeRow,
  DialogueScenarioRow,
  ReadingExerciseRow,
  ReadingProgressRow,
  ReadingQuestionRow,
  StoryRow,
  StorySectionRow,
} from "@/features/reading/types/reading.types";

function normalizeOptions(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

class ReadingRepository {
  async findExerciseById(id: string): Promise<ReadingExerciseRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reading_exercises")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
      ...(data as Omit<ReadingExerciseRow, "options">),
      options: normalizeOptions((data as { options: unknown }).options),
    };
  }

  async listPublishedStories(): Promise<StoryRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("status", "published")
      .order("title");

    if (error) throw new Error(error.message);
    return (data ?? []) as StoryRow[];
  }

  async findStoryBySlug(slug: string): Promise<StoryRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as StoryRow | null) ?? null;
  }

  async findStoryById(id: string): Promise<StoryRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as StoryRow | null) ?? null;
  }

  async listPublishedSectionsByStoryId(storyId: string): Promise<StorySectionRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("story_sections")
      .select("*")
      .eq("story_id", storyId)
      .eq("status", "published")
      .order("order_index");

    if (error) throw new Error(error.message);
    return (data ?? []) as StorySectionRow[];
  }

  async listPublishedQuestionsByStoryId(
    storyId: string,
  ): Promise<ReadingQuestionRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reading_questions")
      .select("*")
      .eq("story_id", storyId)
      .eq("status", "published")
      .order("order_index");

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      ...(row as Omit<ReadingQuestionRow, "options">),
      options: normalizeOptions((row as { options: unknown }).options),
    }));
  }

  async listPublishedDialogues(): Promise<DialogueScenarioRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("dialogue_scenarios")
      .select("*")
      .eq("status", "published")
      .order("title");

    if (error) throw new Error(error.message);
    return (data ?? []) as DialogueScenarioRow[];
  }

  async findDialogueBySlug(slug: string): Promise<DialogueScenarioRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("dialogue_scenarios")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as DialogueScenarioRow | null) ?? null;
  }

  async findDialogueById(id: string): Promise<DialogueScenarioRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("dialogue_scenarios")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as DialogueScenarioRow | null) ?? null;
  }

  async listNodesByScenarioId(scenarioId: string): Promise<DialogueNodeRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("dialogue_nodes")
      .select("*")
      .eq("scenario_id", scenarioId)
      .order("order_index");

    if (error) throw new Error(error.message);
    return (data ?? []) as DialogueNodeRow[];
  }

  async listChoicesByNodeIds(nodeIds: string[]): Promise<DialogueChoiceRow[]> {
    if (nodeIds.length === 0) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("dialogue_choices")
      .select("*")
      .in("node_id", nodeIds)
      .order("order_index");

    if (error) throw new Error(error.message);
    return (data ?? []) as DialogueChoiceRow[];
  }

  async listProgressByUserId(userId: string): Promise<ReadingProgressRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reading_progress")
      .select("*")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return (data ?? []) as ReadingProgressRow[];
  }

  async findProgress(
    userId: string,
    contentType: "story" | "dialogue",
    contentId: string,
  ): Promise<ReadingProgressRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reading_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("content_type", contentType)
      .eq("content_id", contentId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as ReadingProgressRow | null) ?? null;
  }

  async upsertProgress(input: {
    userId: string;
    contentType: "story" | "dialogue";
    contentId: string;
    status: ReadingProgressRow["status"];
    score: number;
  }): Promise<ReadingProgressRow> {
    const supabase = await createClient();
    const completedAt =
      input.status === "completed" ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from("reading_progress")
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
    return data as ReadingProgressRow;
  }
}

export const readingRepository = new ReadingRepository();
