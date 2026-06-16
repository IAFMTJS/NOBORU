"use client";

import Link from "next/link";

import type { SeasonalEventViewModel } from "@/features/events/types/seasonal-event.types";
import { JOURNEY_MOCKUP } from "@/features/journey/constants/journey-mockup.constants";
import { cn } from "@/lib/utils";

type JourneyEventBannerProps = {
  event: SeasonalEventViewModel;
  className?: string;
};

function formatCountdown(endsAt: string): string {
  const end = new Date(endsAt).getTime();
  const now = Date.now();
  const diff = Math.max(0, end - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `Ends in ${days}d ${hours}h`;
  if (hours > 0) return `Ends in ${hours}h`;
  return "Ending soon";
}

/** Mockup event branch card — sakura festival countdown + progress. */
export function JourneyEventBanner({ event, className }: JourneyEventBannerProps) {
  return (
    <Link
      href="/world/events"
      className={cn(
        "pointer-events-auto flex w-[8.5rem] flex-col gap-1.5 rounded-xl border border-pink-400/25 bg-black/55 p-2.5 backdrop-blur-md transition-colors hover:border-pink-400/40",
        JOURNEY_MOCKUP.glass.borderClass,
        className,
      )}
      aria-label={`Seasonal event: ${event.title}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-xs" aria-hidden>
          🌸
        </span>
        <span className="truncate font-story text-[10px] font-semibold uppercase tracking-wide text-pink-200">
          {event.title}
        </span>
      </div>
      <p className="text-[9px] text-white/60">{formatCountdown(event.endsAt)}</p>
      <div className="h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-pink-300"
          style={{ width: `${event.progressPercent}%` }}
        />
      </div>
    </Link>
  );
}
