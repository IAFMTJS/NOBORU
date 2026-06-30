"use client";

import dynamic from "next/dynamic";

const OfflineStatusBanner = dynamic(
  () =>
    import("@/features/offline/components/offline-status-banner").then(
      (module) => ({ default: module.OfflineStatusBanner }),
    ),
  { ssr: false },
);

const OfflineSyncRewardsFeedback = dynamic(
  () =>
    import("@/features/offline/components/offline-sync-rewards-feedback").then(
      (module) => ({ default: module.OfflineSyncRewardsFeedback }),
    ),
  { ssr: false },
);

const ServiceWorkerUpdateBanner = dynamic(
  () =>
    import("@/features/offline/components/service-worker-update-banner").then(
      (module) => ({ default: module.ServiceWorkerUpdateBanner }),
    ),
  { ssr: false },
);

type OfflineProviderChromeProps = {
  isOnline: boolean;
  pendingMutations: number;
  syncRewards: import("@/lib/offline/types").OfflineSyncGamificationResult | null;
  onDismissSyncRewards: () => void;
};

export function OfflineProviderChrome({
  isOnline,
  pendingMutations,
  syncRewards,
  onDismissSyncRewards,
}: OfflineProviderChromeProps) {
  return (
    <>
      <ServiceWorkerUpdateBanner />
      <OfflineStatusBanner isOnline={isOnline} pendingMutations={pendingMutations} />
      <OfflineSyncRewardsFeedback rewards={syncRewards} onDismiss={onDismissSyncRewards} />
    </>
  );
}
