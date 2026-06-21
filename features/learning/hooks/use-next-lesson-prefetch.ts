"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { offlineClient } from "@/features/offline/services/offline-client.service";
import { getLessonAudioPrefetchPlan } from "@/lib/learning/lesson-audio-prefetch";
import {
  parseLessonIdFromHref,
  scheduleIdleTask,
} from "@/lib/learning/lesson-preload";

/**
 * Prefetches the next lesson route, session payload, and opening audio during idle time.
 */
export function useNextLessonPrefetch(nextLessonHref: string | null | undefined): void {
  const router = useRouter();

  useEffect(() => {
    if (!nextLessonHref) return;

    return scheduleIdleTask(() => {
      router.prefetch(nextLessonHref);

      const lessonId = parseLessonIdFromHref(nextLessonHref);
      if (!lessonId) return;

      void offlineClient
        .fetchLessonSession(lessonId)
        .then((session) =>
          offlineClient.prefetchAudioBatch(getLessonAudioPrefetchPlan(session)),
        )
        .catch(() => undefined);
    });
  }, [nextLessonHref, router]);
}
