"use client";

import { useCallback, useEffect, useState } from "react";

import { offlineClient } from "@/features/offline/services/offline-client.service";
import type { OfflineStatusViewModel } from "@/lib/offline/types";

type UseOfflineSyncOptions = {
  userId?: string;
  autoSync?: boolean;
};

export function useOfflineSync(options: UseOfflineSyncOptions = {}) {
  const [status, setStatus] = useState<OfflineStatusViewModel | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const next = await offlineClient.getStatus(options.userId);
    setStatus(next);
    return next;
  }, [options.userId]);

  const syncNow = useCallback(async () => {
    setSyncing(true);
    setError(null);
    try {
      await offlineClient.syncPendingMutations();
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

  return {
    status,
    syncing,
    error,
    refresh,
    syncNow,
  };
}
