"use client";

import { useEffect, useState } from "react";

import { YamaErrorState } from "@/features/yama/components/yama-error-state";
import { YamaLoading } from "@/components/ui/yama-loading";
import { LessonPlayer } from "@/features/learning/components/lesson-player";
import type { LessonSessionViewModel } from "@/features/learning/types/lesson.types";
import { useOnlineStatus } from "@/features/offline/hooks/use-online-status";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import { useNextLessonPrefetch } from "@/features/learning/hooks/use-next-lesson-prefetch";
import { getLessonAudioPrefetchPlan } from "@/lib/learning/lesson-audio-prefetch";

type LessonSessionLoaderProps = {
  lessonId: string;
  initialSession: LessonSessionViewModel | null;
  initialError?: string | null;
  soundEnabled: boolean;
};

export function LessonSessionLoader({
  lessonId,
  initialSession,
  initialError = null,
  soundEnabled,
}: LessonSessionLoaderProps) {
  const online = useOnlineStatus();
  const [session, setSession] = useState<LessonSessionViewModel | null>(
    initialSession,
  );
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(!initialSession && !initialError);
  const [retryCount, setRetryCount] = useState(0);

  useNextLessonPrefetch(session?.nextLesson?.href);

  useEffect(() => {
    if (!initialSession) return;

    void offlineClient.cacheLesson(initialSession);
    void offlineClient.prefetchAudioBatch(
      getLessonAudioPrefetchPlan(initialSession),
    );
  }, [initialSession]);

  useEffect(() => {
    if (initialError) return;
    if (initialSession && online) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (online) {
          const fresh = await offlineClient.fetchLessonSession(lessonId);
          if (!cancelled) setSession(fresh);
          return;
        }

        const cached = await offlineClient.getCachedLesson(lessonId);
        if (!cached) {
          throw new Error("This lesson is not available offline yet.");
        }
        if (!cancelled) setSession(cached);
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Unable to load lesson.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [initialError, initialSession, lessonId, online, retryCount]);

  if (loading && !session) {
    return (
      <YamaLoading
        mode="fullscreen"
        profile="lesson"
        title="Setting up this lesson…"
        statusMessage="Gathering today's lessons…"
      />
    );
  }

  if (error && !session) {
    const isLocked = error.includes("earlier lessons");
    const isNotReady = error.includes("still being prepared");
    return (
      <YamaErrorState
        title={isLocked ? "Lesson locked" : isNotReady ? "Lesson not ready" : "Path blocked"}
        message={error}
        onRetry={() => {
          setError(null);
          setLoading(true);
          setRetryCount((count) => count + 1);
        }}
        actionHref="/tree"
        actionLabel="Return to trail"
      />
    );
  }

  if (!session) {
    return (
      <YamaLoading
        mode="fullscreen"
        profile="lesson"
        title="Setting up this lesson…"
        statusMessage="Gathering today's lessons…"
      />
    );
  }

  return <LessonPlayer session={session} soundEnabled={soundEnabled} />;
}
