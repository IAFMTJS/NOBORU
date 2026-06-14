"use client";

import { useEffect, useState } from "react";

import type { LessonSummaryViewModel } from "@/features/learning/types/lesson.types";

type UseJourneyLessonSummaryResult = {
  lesson: LessonSummaryViewModel | null;
  loading: boolean;
};

export function useJourneyLessonSummary(
  lessonId: string | null,
  enabled: boolean,
): UseJourneyLessonSummaryResult {
  const [lesson, setLesson] = useState<LessonSummaryViewModel | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !lessonId) {
      setLesson(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void fetch(`/api/learning/lessons/${lessonId}/summary`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { data?: LessonSummaryViewModel } | null) => {
        if (!cancelled) {
          setLesson(payload?.data ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLesson(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, lessonId]);

  return { lesson, loading };
}
