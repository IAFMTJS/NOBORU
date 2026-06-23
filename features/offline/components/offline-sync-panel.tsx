"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/visual";
import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { useOfflineContext } from "@/features/offline/components/offline-provider";
import { offlinePrefetchService } from "@/features/offline/services/offline-prefetch.service";
import { cn } from "@/lib/utils";
import { getOfflineSyncHint } from "@/lib/pwa/ios-sync-hint";

function SyncStatRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl px-3 py-2",
        glassSurface.chip,
      )}
    >
      <span className="text-body-sm">{label}</span>
      <span className="text-caption text-muted-foreground">{value}</span>
    </div>
  );
}

export function OfflineSyncPanel() {
  const { status, syncing, error, syncNow, refresh, userId } = useOfflineContext();
  const [preparing, setPreparing] = useState(false);
  const [prepareMessage, setPrepareMessage] = useState<string | null>(null);
  const [prepareError, setPrepareError] = useState<string | null>(null);

  if (!status) return null;

  async function handlePrepareForOffline() {
    if (!userId || !status?.isOnline) return;
    setPreparing(true);
    setPrepareMessage(null);
    setPrepareError(null);
    try {
      const result = await offlinePrefetchService.prepareForOffline(userId);
      await refresh();
      setPrepareMessage(
        `Prepared ${result.lessonsCached} lesson${result.lessonsCached === 1 ? "" : "s"}, ${result.reviewCardsCached} review card${result.reviewCardsCached === 1 ? "" : "s"}, and ${result.audioFilesCached} audio clip${result.audioFilesCached === 1 ? "" : "s"}.`,
      );
      if (result.errors.length > 0) {
        setPrepareError(result.errors[0] ?? "Some items could not be cached.");
      }
    } catch (caught) {
      setPrepareError(
        caught instanceof Error ? caught.message : "Unable to prepare offline cache.",
      );
    } finally {
      setPreparing(false);
    }
  }

  return (
    <GlassPanel className="space-y-3 p-4">
      <div className="space-y-1">
        <h3 className="font-sans text-body font-semibold tracking-wide">Offline & Sync</h3>
        <p className="text-caption text-muted-foreground">
          {getOfflineSyncHint()}
        </p>
      </div>
      <SyncStatRow
        label="Connection"
        value={status.isOnline ? "Online" : "Offline"}
      />
      <SyncStatRow
        label="Pending sync"
        value={`${status.pendingMutations} item${status.pendingMutations === 1 ? "" : "s"}`}
      />
      <SyncStatRow label="Cached lessons" value={String(status.cachedLessons)} />
      <SyncStatRow label="Cached review cards" value={String(status.cachedReviewCards)} />
      <SyncStatRow label="Cached audio" value={String(status.cachedAudioFiles)} />
      {status.lastSyncedAt ? (
        <SyncStatRow
          label="Last synced"
          value={new Date(status.lastSyncedAt).toLocaleString()}
        />
      ) : null}
      {error ? (
        <p className="text-caption text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {prepareMessage ? (
        <p className="text-caption text-muted-foreground" role="status">
          {prepareMessage}
        </p>
      ) : null}
      {prepareError ? (
        <p className="text-caption text-destructive" role="alert">
          {prepareError}
        </p>
      ) : null}
      <Button
        className="w-full"
        variant="secondary"
        loading={preparing}
        disabled={!status.isOnline || !userId}
        onClick={() => void handlePrepareForOffline()}
      >
        Prepare for offline
      </Button>
      <div className="flex gap-2">
        <Button
          className="flex-1"
          loading={syncing}
          disabled={!status.isOnline || status.pendingMutations === 0}
          onClick={() => void syncNow()}
        >
          Sync now
        </Button>
        <Button variant="outline" onClick={() => void refresh()}>
          Refresh
        </Button>
      </div>
      <Button variant="ghost" className="w-full" asChild>
        <Link href="/offline">About offline continuity</Link>
      </Button>
    </GlassPanel>
  );
}
