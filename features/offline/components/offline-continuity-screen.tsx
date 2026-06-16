"use client";

import Link from "next/link";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { GlassPanel, PrimaryClimbButton } from "@/components/visual";
import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";
import { useOfflineContext } from "@/features/offline/components/offline-provider";
import { cn } from "@/lib/utils";

function ContinuityStatRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl px-3 py-2",
        glassSurface.chip,
      )}
    >
      <span className="text-body-sm">{label}</span>
      <span className="text-caption text-muted-foreground">{value}</span>
    </div>
  );
}

const OFFLINE_FEATURES = [
  "Cached lessons and review sessions",
  "Vocabulary, kanji, and grammar study",
  "Progress tracking on this device",
  "Queued sync when you reconnect",
];

const ONLINE_ONLY_FEATURES = [
  "Friend activity and league rankings",
  "Shop purchases and live events",
  "Account settings sync",
];

export function OfflineContinuityScreen() {
  const { status } = useOfflineContext();
  const isOnline = status?.isOnline ?? true;

  return (
    <SecondaryScreenShell
      title="Offline continuity"
      subtitle="Limited, not broken — the climb continues without signal"
      backHref="/settings"
      backLabel="Settings"
      contentClassName="pb-2"
    >
      <div className="mx-auto max-w-md space-y-4">
        <GlassPanel className="space-y-3 p-4">
          <div className="space-y-1">
            <p className="text-body-sm font-semibold">Current status</p>
            <p className="text-caption text-muted-foreground">
              {isOnline
                ? "You are online. Cached content stays ready for the next offline stretch."
                : "You are offline. Core study features remain available from local cache."}
            </p>
          </div>
          {status ? (
            <>
              <ContinuityStatRow
                label="Connection"
                value={status.isOnline ? "Online" : "Offline"}
              />
              <ContinuityStatRow
                label="Pending sync"
                value={`${status.pendingMutations} item${status.pendingMutations === 1 ? "" : "s"}`}
              />
              <ContinuityStatRow label="Cached lessons" value={String(status.cachedLessons)} />
            </>
          ) : null}
        </GlassPanel>

        <GlassPanel className="space-y-3 p-4">
          <h2 className="font-sans text-body font-semibold">Available offline</h2>
          <ul className="space-y-2">
            {OFFLINE_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-body-sm text-muted-foreground"
              >
                <UiIconImage name="check" size={16} className="mt-0.5 shrink-0 text-success" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </GlassPanel>

        <GlassPanel className="space-y-3 p-4">
          <h2 className="font-sans text-body font-semibold">Needs connection</h2>
          <ul className="space-y-2">
            {ONLINE_ONLY_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-body-sm text-muted-foreground"
              >
                <UiIconImage name="lock" size={16} className="mt-0.5 shrink-0 opacity-70" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </GlassPanel>

        <PrimaryClimbButton asChild className="mx-auto max-w-md">
          <Link href="/study">Continue studying</Link>
        </PrimaryClimbButton>
      </div>
    </SecondaryScreenShell>
  );
}
