"use client";

import Link from "next/link";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import {
  GlassPanel,
  IllustratedScreen,
  PrimaryClimbButton,
  StoryTitle,
} from "@/components/visual";
import { useOfflineContext } from "@/features/offline/components/offline-provider";

function ContinuityStatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
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
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="review_atmosphere"
          alt="Quiet camp at night while offline"
          className="absolute inset-0 min-h-dvh rounded-none"
          priority
        />
      }
    >
      <div className="relative flex min-h-dvh flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/85"
          aria-hidden
        />

        <header className="relative z-10 shrink-0 space-y-3 p-4 pt-3">
          <Link
            href="/settings"
            className="inline-flex items-center gap-1.5 text-body-sm text-white/70 transition-colors hover:text-white"
          >
            <UiIconImage name="arrow_left" size={16} />
            Settings
          </Link>

          <GlassPanel variant="header" className="space-y-1 rounded-card p-4">
            <StoryTitle as="h1" className="text-base">
              Offline continuity
            </StoryTitle>
            <p className="text-caption text-muted-foreground">
              Limited, not broken — the climb continues without signal
            </p>
          </GlassPanel>
        </header>

        <main className="relative z-10 flex-1 space-y-4 overflow-y-auto px-4 py-2">
          <div className="mx-auto max-w-md space-y-4 pb-4">
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
                  <ContinuityStatRow
                    label="Cached lessons"
                    value={String(status.cachedLessons)}
                  />
                </>
              ) : null}
            </GlassPanel>

            <GlassPanel className="space-y-3 p-4">
              <StoryTitle as="h2" className="text-sm">
                Available offline
              </StoryTitle>
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
              <StoryTitle as="h2" className="text-sm">
                Needs connection
              </StoryTitle>
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
          </div>
        </main>

        <footer className="relative z-10 shrink-0 p-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-2">
          <PrimaryClimbButton asChild className="mx-auto max-w-md">
            <Link href="/study">Continue studying</Link>
          </PrimaryClimbButton>
        </footer>
      </div>
    </IllustratedScreen>
  );
}
