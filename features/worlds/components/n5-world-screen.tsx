"use client";

import { useEffect, useState } from "react";

import type { JourneyRegionViewModel } from "@/features/journey/types/journey.types";

import { N5PortalTransition } from "@/features/worlds/components/n5-portal-transition";
import { N5WorldCanvas } from "@/features/worlds/components/n5-world-canvas";
import { PwaInstallSlot } from "@/features/offline/components/pwa-install-slot";

export type N5WorldScreenProps = {
  region: JourneyRegionViewModel;
  currentNodeId: string | null;
  focusNodeId?: string | null;
  showPortal?: boolean;
  profileStats: {
    displayName: string;
    levelLabel: string;
    currentStreak: number;
  } | null;
};

export function N5WorldScreen({
  region,
  currentNodeId,
  focusNodeId,
  showPortal = false,
  profileStats,
}: N5WorldScreenProps) {
  const [portalOpen, setPortalOpen] = useState(showPortal);

  useEffect(() => {
    if (showPortal) setPortalOpen(true);
  }, [showPortal]);

  return (
    <>
      <N5WorldCanvas
        region={region}
        currentNodeId={currentNodeId}
        focusNodeId={focusNodeId}
        hud={{
          displayName: profileStats?.displayName,
          levelLabel: profileStats?.levelLabel,
          currentStreak: profileStats?.currentStreak,
        }}
      />
      <N5PortalTransition open={portalOpen} onStay={() => setPortalOpen(false)} />
      <PwaInstallSlot />
    </>
  );
}
