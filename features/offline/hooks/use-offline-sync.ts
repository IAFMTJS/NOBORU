"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { offlineClient } from "@/features/offline/services/offline-client.service";
import { useOnlineStatus } from "@/features/offline/hooks/use-online-status";
import type {
  OfflineStatusViewModel,
  OfflineSyncGamificationResult,
} from "@/lib/offline/types";

type UseOfflineSyncOptions = {
  userId?: string;
  autoSync?: boolean;
};

export function useOfflineSync(options: UseOfflineSyncOptions = {}) {
  const isOnline = useOnlineStatus();
  const [status, setStatus] = useState<OfflineStatusViewModel | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncRewards, setSyncRewards] =
    useState<OfflineSyncGamificationResult | null>(null);
  const hasAttemptedInitialSync = useRef(false);

  const refresh = useCallback(async () => {
    const next = await offlineClient.getStatus(options.userId);
    setStatus(next);
    return next;
  }, [options.userId]);

  const dismissSyncRewards = useCallback(() => {
    setSyncRewards(null);
  }, []);

  const syncNow = useCallback(async () => {
    setSyncing(true);
    setError(null);
    try {
      const result = await offlineClient.syncPendingMutations();
      if (result.aggregatedGamification) {
        setSyncRewards(result.aggregatedGamification);
      }
      await refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sync failed.");
      throw caught;
    } finally {
      setSyncing(false);
    }
  }, [refresh]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!options.autoSync) return;

    const handleOnline = () => {
      void syncNow().catch(() => undefined);
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [options.autoSync, syncNow]);

  useEffect(() => {
    if (!options.autoSync || !status || hasAttemptedInitialSync.current) return;
    if (!isOnline || status.pendingMutations === 0 || syncing) return;
    hasAttemptedInitialSync.current = true;
    void syncNow().catch(() => undefined);
  }, [isOnline, options.autoSync, status, syncNow, syncing]);

  return {
    status,
    syncing,
    error,
    syncRewards,
    refresh,
    syncNow,
    dismissSyncRewards,
  };
}
