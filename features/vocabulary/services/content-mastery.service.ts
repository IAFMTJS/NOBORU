import { createClient } from "@/lib/supabase/server";
import { evaluateWordMastery } from "@/lib/learning/vocabulary-lifecycle";
import type { WordMasteryStats } from "@/lib/learning/learning-architecture.types";

export type ContentMasteryRow = {
  id: string;
  user_id: string;
  content_type: string;
  content_id: string;
  correct_answer_count: number;
  exercise_types: string[];
  session_count: number;
  practice_day_keys: string[];
  last_correct_at: string | null;
  created_at: string;
  updated_at: string;
};

function rowToStats(row: ContentMasteryRow): WordMasteryStats {
  return {
    correctAnswerCount: row.correct_answer_count,
    distinctExerciseTypes: row.exercise_types.length,
    distinctSessionCount: row.session_count,
    distinctDayCount: row.practice_day_keys.length,
  };
}

class ContentMasteryRepository {
  async findByContent(
    userId: string,
    contentType: string,
    contentId: string,
  ): Promise<ContentMasteryRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_content_mastery")
      .select("*")
      .eq("user_id", userId)
      .eq("content_type", contentType)
      .eq("content_id", contentId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as ContentMasteryRow) ?? null;
  }

  async recordCorrectAnswer(input: {
    userId: string;
    contentType: string;
    contentId: string;
    exerciseType: string;
    sessionId?: string;
    practicedAt?: Date;
  }): Promise<ContentMasteryRow> {
    const supabase = await createClient();
    const practicedAt = input.practicedAt ?? new Date();
    const dayKey = practicedAt.toISOString().slice(0, 10);

    const existing = await this.findByContent(
      input.userId,
      input.contentType,
      input.contentId,
    );

    const exerciseTypes = new Set(existing?.exercise_types ?? []);
    exerciseTypes.add(input.exerciseType);

    const practiceDayKeys = new Set(existing?.practice_day_keys ?? []);
    practiceDayKeys.add(dayKey);

    const sessionCount = (existing?.session_count ?? 0) + (input.sessionId ? 1 : 0);

    const payload = {
      user_id: input.userId,
      content_type: input.contentType,
      content_id: input.contentId,
      correct_answer_count: (existing?.correct_answer_count ?? 0) + 1,
      exercise_types: Array.from(exerciseTypes),
      session_count: sessionCount,
      practice_day_keys: Array.from(practiceDayKeys).slice(-30),
      last_correct_at: practicedAt.toISOString(),
    };

    const { data, error } = await supabase
      .from("user_content_mastery")
      .upsert(payload, { onConflict: "user_id,content_type,content_id" })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ContentMasteryRow;
  }
}

class ContentMasteryService {
  async recordCorrectAnswer(input: {
    userId: string;
    contentType: string;
    contentId: string;
    exerciseType: string;
    sessionId?: string;
    practicedAt?: Date;
  }) {
    const row = await contentMasteryRepository.recordCorrectAnswer(input);
    const evaluation = evaluateWordMastery(rowToStats(row));
    return { row, evaluation };
  }

  async evaluateContentMastery(
    userId: string,
    contentType: string,
    contentId: string,
  ) {
    const row = await contentMasteryRepository.findByContent(
      userId,
      contentType,
      contentId,
    );
    if (!row) {
      return evaluateWordMastery({
        correctAnswerCount: 0,
        distinctExerciseTypes: 0,
        distinctSessionCount: 0,
        distinctDayCount: 0,
      });
    }
    return evaluateWordMastery(rowToStats(row));
  }
}

export const contentMasteryRepository = new ContentMasteryRepository();
export const contentMasteryService = new ContentMasteryService();
