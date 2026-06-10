"use client";

import { useEffect, useState } from "react";

import { YamaLoading } from "@/components/ui/yama-loading";
import { ReviewSession } from "@/features/review/components/review-session";
import type { ReviewSessionViewModel } from "@/features/review/types/review.types";
import { useOnlineStatus } from "@/features/offline/hooks/use-online-status";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import type { OfflineReviewBundle } from "@/lib/offline/types";

type ReviewSessionLoaderProps = {
  userId: string;
  initialSession: ReviewSessionViewModel;
};

export function ReviewSessionLoader({
  userId,
  initialSession,
}: ReviewSessionLoaderProps) {
  const online = useOnlineStatus();
  const [session, setSession] = useState(initialSession);
  const [bundle, setBundle] = useState<OfflineReviewBundle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      setError(null);
      try {
        if (online) {
          const response = await fetch("/api/review/session");
          const result = (await response.json()) as {
            success: boolean;
            data?: OfflineReviewBundle;
            error?: string;
          };
          if (!result.success || !result.data) {
            throw new Error(result.error ?? "Failed to load review session.");
          }
          await offlineClient.cacheReviewBundle(result.data);
          if (!cancelled) {
            setBundle(result.data);
            setSession(result.data.session);
          }
          return;
        }

        const cached = await offlineClient.getCachedReviewBundle(userId);
        if (!cached) {
          throw new Error("Review queue is not available offline yet.");
        }
        if (!cancelled) {
          setBundle(cached);
          setSession(cached.session);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error ? caught.message : "Unable to load reviews.",
          );
        }
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [online, userId]);

  if (error) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-body-sm text-destructive" role="alert">
          {error}
        </p>
      </div>
    );
  }

  if (!bundle) {
    return <YamaLoading message="Loading review queue…" />;
  }

  return (
    <ReviewSession
      initialSession={session}
      offlineBundle={bundle}
      onBundleChange={setBundle}
    />
  );
}
