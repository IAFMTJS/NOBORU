"use client";

import Link from "next/link";
import { useMemo } from "react";

import { GlassPanel, RewardChip } from "@/components/visual";
import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import type { SeasonalEventViewModel } from "@/features/events/types/seasonal-event.types";
import { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";
import { cn } from "@/lib/utils";

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
    <div className={cn("flex min-w-[7rem] flex-col items-center gap-2 px-3 py-4 text-center", glassSurface.card)}>
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
    <SecondaryScreenShell
      title={event.title}
      subtitle={event.description}
      backHref="/camp"
      backLabel="Camp"
      contentClassName="pb-2"
    >
      <div className="mx-auto max-w-md space-y-4">
        {event.titleJa ? (
          <p className="text-center font-japanese text-body-sm text-primary/90">{event.titleJa}</p>
        ) : null}

        <GlassPanel className="p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-body-sm font-semibold">Festival lanterns lit</span>
            <span className="text-caption text-muted-foreground">{formatCountdown(event.endsAt)}</span>
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
        </GlassPanel>

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

        <Link
          href="/tree"
          className="focus-ring mx-auto flex h-12 max-w-md items-center justify-center rounded-[var(--radius)] bg-primary text-base font-semibold text-primary-foreground shadow-elevation-2"
        >
          Continue festival climb
        </Link>
      </div>
    </SecondaryScreenShell>
  );
}
