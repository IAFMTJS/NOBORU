"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (initialSession) {
      void offlineClient.cacheLesson(initialSession);
      void offlineClient.prefetchAudioBatch(
        getLessonAudioPrefetchPlan(initialSession),
      );
    }
  }, [initialSession]);

  useEffect(() => {
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
  }, [lessonId, online]);

  if (loading && !session) {
    return <YamaLoading message="Loading lesson…" />;
  }

  if (error && !session) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-body-sm text-destructive" role="alert">
          {error}
        </p>
      </div>
    );
  }

  if (!session) {
    return <YamaLoading message="Loading lesson…" />;
  }

  return <LessonPlayer session={session} soundEnabled={soundEnabled} />;
}
