"use client";

import dynamic from "next/dynamic";

const OfflineSyncPanel = dynamic(
  () =>
    import("@/features/offline/components/offline-sync-panel").then((module) => ({
      default: module.OfflineSyncPanel,
    })),
  { ssr: false },
);

const PwaInstallPrompt = dynamic(
  () =>
    import("@/features/offline/components/pwa-install-prompt").then((module) => ({
      default: module.PwaInstallPrompt,
    })),
  { ssr: false },
);

export function SettingsOfflineSection() {
  return (
    <>
      <PwaInstallPrompt />
      <OfflineSyncPanel />
    </>
  );
}
