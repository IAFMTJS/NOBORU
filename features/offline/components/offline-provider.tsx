"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

import { OfflineProviderChrome } from "@/features/offline/components/offline-provider-chrome";
import { useOfflineSync } from "@/features/offline/hooks/use-offline-sync";
import { useOnlineStatus } from "@/features/offline/hooks/use-online-status";
import type {
  OfflineStatusViewModel,
  OfflineSyncGamificationResult,
} from "@/lib/offline/types";

type OfflineContextValue = {
  userId?: string;
  isOnline: boolean;
  pendingMutations: number;
  status: OfflineStatusViewModel | null;
  syncing: boolean;
  error: string | null;
  syncRewards: OfflineSyncGamificationResult | null;
  refresh: () => Promise<OfflineStatusViewModel>;
  syncNow: () => Promise<void>;
  dismissSyncRewards: () => void;
};

const OfflineContext = createContext<OfflineContextValue | null>(null);

export function useOfflineContext() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error("useOfflineContext must be used within OfflineProvider.");
  }
  return context;
}

type OfflineProviderProps = {
  children: ReactNode;
  userId?: string;
};

export function OfflineProvider({ children, userId }: OfflineProviderProps) {
  const isOnline = useOnlineStatus();
  const {
    status,
    syncing,
    error,
    syncRewards,
    syncNow,
    refresh,
    dismissSyncRewards,
  } = useOfflineSync({
    userId,
    autoSync: true,
  });

  useEffect(() => {
    const registerServiceWorker = () => {
      if ("serviceWorker" in navigator) {
        void navigator.serviceWorker.register("/sw.js");
      }
    };

    if (typeof requestIdleCallback === "function") {
      const idleId = requestIdleCallback(registerServiceWorker);
      return () => cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(registerServiceWorker, 1500);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <OfflineContext.Provider
      value={{
        userId,
        isOnline,
        pendingMutations: status?.pendingMutations ?? 0,
        status,
        syncing,
        error,
        syncRewards,
        refresh,
        syncNow,
        dismissSyncRewards,
      }}
    >
      <OfflineProviderChrome
        isOnline={isOnline}
        pendingMutations={status?.pendingMutations ?? 0}
        syncRewards={syncRewards}
        onDismissSyncRewards={dismissSyncRewards}
      />
      {children}
    </OfflineContext.Provider>
  );
}
