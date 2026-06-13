"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListRow } from "@/components/ui/list-row";
import { useOfflineContext } from "@/features/offline/components/offline-provider";

export function OfflineSyncPanel() {
  const { status, syncing, error, syncNow, refresh } = useOfflineContext();

  if (!status) return null;

  return (
    <Card className="shadow-elevation-1">
      <CardHeader>
        <CardTitle className="text-heading-6">Offline & Sync</CardTitle>
        <CardDescription>
          Cached lessons, reviews, and progress sync when you reconnect.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ListRow
          primary="Connection"
          secondary={status.isOnline ? "Online" : "Offline"}
        />
        <ListRow
          primary="Pending sync"
          secondary={`${status.pendingMutations} item${status.pendingMutations === 1 ? "" : "s"}`}
        />
        <ListRow
          primary="Cached lessons"
          secondary={String(status.cachedLessons)}
        />
        <ListRow
          primary="Cached review cards"
          secondary={String(status.cachedReviewCards)}
        />
        <ListRow
          primary="Cached audio"
          secondary={String(status.cachedAudioFiles)}
        />
        {status.lastSyncedAt ? (
          <ListRow
            primary="Last synced"
            secondary={new Date(status.lastSyncedAt).toLocaleString()}
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
      </CardContent>
    </Card>
  );
}
