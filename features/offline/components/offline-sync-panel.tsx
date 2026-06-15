"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { GlassPanel, StoryTitle } from "@/components/visual";
import { useOfflineContext } from "@/features/offline/components/offline-provider";

function SyncStatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
      <span className="text-body-sm">{label}</span>
      <span className="text-caption text-muted-foreground">{value}</span>
    </div>
  );
}

export function OfflineSyncPanel() {
  const { status, syncing, error, syncNow, refresh } = useOfflineContext();

  if (!status) return null;

  return (
    <GlassPanel className="space-y-3 p-4">
      <div className="space-y-1">
        <StoryTitle as="h3" className="text-sm tracking-wide">
          Offline & Sync
        </StoryTitle>
        <p className="text-caption text-muted-foreground">
          Cached lessons, reviews, and progress sync when you reconnect.
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
