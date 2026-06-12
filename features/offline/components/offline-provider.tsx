"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

import { OfflineStatusBanner } from "@/features/offline/components/offline-status-banner";
import { useOfflineSync } from "@/features/offline/hooks/use-offline-sync";
import { useOnlineStatus } from "@/features/offline/hooks/use-online-status";
import { preloadJapaneseSpeechVoices } from "@/lib/audio/japanese-speech";

type OfflineContextValue = {
  isOnline: boolean;
  pendingMutations: number;
};

const OfflineContext = createContext<OfflineContextValue>({
  isOnline: true,
  pendingMutations: 0,
});

export function useOfflineContext() {
  return useContext(OfflineContext);
}

type OfflineProviderProps = {
  children: ReactNode;
  userId?: string;
};

export function OfflineProvider({ children, userId }: OfflineProviderProps) {
  const isOnline = useOnlineStatus();
  const { status, syncNow } = useOfflineSync({ userId, autoSync: true });

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js");
    }
    void preloadJapaneseSpeechVoices();
  }, []);

  useEffect(() => {
    if (isOnline && (status?.pendingMutations ?? 0) > 0) {
      void syncNow().catch(() => undefined);
    }
  }, [isOnline, status?.pendingMutations, syncNow]);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        pendingMutations: status?.pendingMutations ?? 0,
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
