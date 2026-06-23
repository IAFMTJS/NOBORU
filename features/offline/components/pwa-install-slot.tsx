"use client";

import { PwaInstallPrompt } from "@/features/offline/components/pwa-install-prompt";

export function PwaInstallSlot() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--nav-height,4.5rem)+0.75rem)] z-40 mx-auto max-w-phone px-4">
      <div className="pointer-events-auto">
        <PwaInstallPrompt />
      </div>
    </div>
  );
}
