"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

import { OfflineStatusBanner } from "@/features/offline/components/offline-status-banner";
import { useOfflineSync } from "@/features/offline/hooks/use-offline-sync";
import { useOnlineStatus } from "@/features/offline/hooks/use-online-status";
import { preloadJapaneseSpeechVoices } from "@/lib/audio/japanese-speech";
import type { OfflineStatusViewModel } from "@/lib/offline/types";

type OfflineContextValue = {
  isOnline: boolean;
  pendingMutations: number;
  status: OfflineStatusViewModel | null;
  syncing: boolean;
  error: string | null;
  refresh: () => Promise<OfflineStatusViewModel>;
  syncNow: () => Promise<void>;
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
  const { status, syncing, error, syncNow, refresh } = useOfflineSync({
    userId,
    autoSync: true,
  });

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js");
    }
    void preloadJapaneseSpeechVoices();
  }, []);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        pendingMutations: status?.pendingMutations ?? 0,
        status,
        syncing,
        error,
        refresh,
        syncNow,
      }}
    >
      <OfflineStatusBanner
        isOnline={isOnline}
        pendingMutations={status?.pendingMutations ?? 0}
      />
      {children}
    </OfflineContext.Provider>
  );
}
