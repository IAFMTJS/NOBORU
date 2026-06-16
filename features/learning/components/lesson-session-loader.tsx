"use client";

import { useEffect, useState } from "react";

import { YamaErrorState } from "@/features/yama/components/yama-error-state";
import { YamaLoading } from "@/components/ui/yama-loading";
import { LessonPlayer } from "@/features/learning/components/lesson-player";
import type { LessonSessionViewModel } from "@/features/learning/types/lesson.types";
import { useOnlineStatus } from "@/features/offline/hooks/use-online-status";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import { getLessonAudioPrefetchPlan } from "@/lib/learning/lesson-audio-prefetch";

type LessonSessionLoaderProps = {
  lessonId: string;
  initialSession: LessonSessionViewModel | null;
  soundEnabled: boolean;
};

export function LessonSessionLoader({
  lessonId,
  initialSession,
  soundEnabled,
}: LessonSessionLoaderProps) {
  const online = useOnlineStatus();
  const [session, setSession] = useState<LessonSessionViewModel | null>(
    initialSession,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initialSession);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!initialSession) return;

    void offlineClient.cacheLesson(initialSession);
    void offlineClient.prefetchAudioBatch(
      getLessonAudioPrefetchPlan(initialSession),
    );
  }, [initialSession]);

  useEffect(() => {
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
  }, [initialSession, lessonId, online, retryCount]);

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
    return (
      <YamaErrorState
        message={error}
        onRetry={() => {
          setError(null);
          setLoading(true);
          setRetryCount((count) => count + 1);
        }}
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
