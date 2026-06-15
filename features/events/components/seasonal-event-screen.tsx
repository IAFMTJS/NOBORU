"use client";

import Link from "next/link";
import { useMemo } from "react";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { RewardChip, IllustratedScreen, StoryTitle } from "@/components/visual";
import type { SeasonalEventViewModel } from "@/features/events/types/seasonal-event.types";
import { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";

type SeasonalEventScreenProps = {
  event: SeasonalEventViewModel;
};

function formatCountdown(endsAt: string): string {
  const remaining = Math.max(0, new Date(endsAt).getTime() - Date.now());
  const days = Math.ceil(remaining / 86400000);
  if (days <= 0) return "Festival closing soon";
  return days === 1 ? "1 day of celebration left" : `${days} days of celebration left`;
}

function FestivalRewardStall({
  iconLabel,
  label,
  amount,
  currency,
}: {
  iconLabel: string;
  label: string;
  amount: number;
  currency: string;
}) {
  return (
    <div className="flex min-w-[7rem] flex-col items-center gap-2 rounded-2xl border border-amber-900/35 bg-gradient-to-b from-amber-950/50 to-black/55 px-3 py-4 text-center shadow-inner">
      <span className="text-2xl" aria-hidden>
        {iconLabel}
      </span>
      <p className="text-caption font-medium">{label}</p>
      <RewardChip variant={currency === "gems" ? "gem" : "xp"} className="text-caption">
        {amount}
      </RewardChip>
    </div>
  );
}

export function SeasonalEventScreen({ event }: SeasonalEventScreenProps) {
  const progressLanterns = useMemo(
    () => Math.min(5, Math.max(1, Math.ceil(event.progressPercent / 20))),
    [event.progressPercent],
  );

  return (
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="seasonal_sakura"
          alt=""
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      <div className="relative flex min-h-dvh flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/75"
          aria-hidden
        />

        <header className="relative z-10 shrink-0 space-y-3 p-4 pt-3">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-body-sm text-white/70 transition-colors hover:text-white"
          >
            <UiIconImage name="arrow_left" size={16} />
            Journey
          </Link>

          <div className="space-y-2 rounded-card border border-pink-200/20 bg-black/45 p-4">
            <p className="font-japanese text-body-sm text-primary/90">{event.titleJa}</p>
            <StoryTitle as="h1" className="text-base">
              {event.title}
            </StoryTitle>
            <p className="text-caption text-muted-foreground">{event.description}</p>
          </div>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-2">
          <div className="mx-auto max-w-md space-y-4 pb-4">
            <div className="rounded-2xl border border-white/12 bg-black/40 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-body-sm font-semibold">Festival lanterns lit</span>
                <span className="text-caption text-muted-foreground">
                  {formatCountdown(event.endsAt)}
                </span>
              </div>
              <div className="mt-3 flex justify-center gap-1" aria-hidden>
                {Array.from({ length: progressLanterns }).map((_, index) => (
                  <WorldArtImage
                    key={index}
                    asset={INVENTORY_ITEM_ASSETS.stone_lantern}
                    alt=""
                    width={32}
                    height={40}
                    className="trail-glow-warm opacity-90"
                  />
                ))}
              </div>
              <p className="mt-2 text-center text-caption text-muted-foreground">
                {event.progressPercent}% along the festival path ·{" "}
                {event.joined ? "You joined the celebration" : "Awaiting discovery"}
              </p>
            </div>

            <section aria-labelledby="event-rewards-heading" className="space-y-2">
              <h2 id="event-rewards-heading" className="font-story text-sm text-trail-glow">
                Festival reward stalls
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {event.rewards.map((reward) => (
                  <FestivalRewardStall
                    key={reward.id}
                    iconLabel={reward.iconLabel}
                    label={reward.label}
                    amount={reward.amount}
                    currency={reward.currency}
                  />
                ))}
              </div>
            </section>
          </div>
        </main>

        <footer className="relative z-10 shrink-0 p-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-2">
          <Link
            href="/learn"
            className="focus-ring mx-auto flex h-12 max-w-md items-center justify-center rounded-[var(--radius)] bg-primary text-base font-semibold text-primary-foreground shadow-elevation-2"
          >
            Continue festival climb
          </Link>
        </footer>
      </div>
    </IllustratedScreen>
  );
}
