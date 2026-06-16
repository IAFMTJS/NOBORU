"use client";

import { useEffect, useState } from "react";

import { YamaErrorState } from "@/features/yama/components/yama-error-state";
import { YamaLoading } from "@/components/ui/yama-loading";
import { ReviewSession } from "@/features/review/components/review-session";
import { useOnlineStatus } from "@/features/offline/hooks/use-online-status";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import type { OfflineReviewBundle } from "@/lib/offline/types";

type ReviewSessionLoaderProps = {
  userId: string;
  initialBundle: OfflineReviewBundle;
  sessionLimit?: number | null;
  contentType?: string | null;
  weakOnly?: boolean;
};

export function ReviewSessionLoader({
  userId,
  initialBundle,
  sessionLimit = null,
  contentType = null,
  weakOnly = false,
}: ReviewSessionLoaderProps) {
  const online = useOnlineStatus();
  const [bundle, setBundle] = useState(initialBundle);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setBundle(initialBundle);
  }, [initialBundle]);

  useEffect(() => {
    let cancelled = false;

    async function syncOfflineCache() {
      setError(null);
      try {
        if (online) {
          await offlineClient.cacheReviewBundle(initialBundle);
          return;
        }

        const cached = await offlineClient.getCachedReviewBundle(userId);
        if (!cached) {
          throw new Error("Review queue is not available offline yet.");
        }
        if (!cancelled) {
          setBundle(cached);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error ? caught.message : "Unable to load reviews.",
          );
        }
      }
    }

    void syncOfflineCache();
    return () => {
      cancelled = true;
    };
  }, [initialBundle, online, userId, retryCount]);

  if (error) {
    return (
      <YamaErrorState
        message={error}
        onRetry={() => {
          setError(null);
          setRetryCount((count) => count + 1);
        }}
      />
    );
  }

  if (!bundle) {
    return (
      <YamaLoading
        mode="fullscreen"
        profile="review"
        title="Warming up your recall…"
        statusMessage="Checking your backpack…"
      />
    );
  }

  return (
    <ReviewSession
      initialSession={bundle.session}
      offlineBundle={bundle}
      onBundleChange={setBundle}
      sessionLimit={sessionLimit}
      contentType={contentType}
      weakOnly={weakOnly}
    />
  );
}
