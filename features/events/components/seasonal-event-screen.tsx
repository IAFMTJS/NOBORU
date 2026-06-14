"use client";

import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  GlassPanel,
  IllustratedScreen,
  PrimaryClimbButton,
  RewardChip,
  StoryTitle,
} from "@/components/visual";
import type { SeasonalEventViewModel } from "@/features/events/types/seasonal-event.types";

type SeasonalEventScreenProps = {
  event: SeasonalEventViewModel;
};

function formatCountdown(endsAt: string): string {
  const remaining = Math.max(0, new Date(endsAt).getTime() - Date.now());
  const days = Math.ceil(remaining / 86400000);
  if (days <= 0) return "Event ending soon";
  return days === 1 ? "1 day remaining" : `${days} days remaining`;
}

export function SeasonalEventScreen({ event }: SeasonalEventScreenProps) {
  return (
    <IllustratedScreen
      scrim="minimal"
      background={
        <SceneImage
          scene="seasonal_sakura"
          alt=""
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      <PageContainer className="space-y-5">
        <Link
          href="/world"
          className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <UiIconImage name="arrow_left" size={16} />
          World
        </Link>

        <header className="space-y-2">
          <p className="font-[family-name:var(--font-noto-sans-jp)] text-body-sm text-primary/90">
            {event.titleJa}
          </p>
          <StoryTitle as="h1">{event.title}</StoryTitle>
          <p className="text-body-sm text-muted-foreground">{event.description}</p>
        </header>

        <GlassPanel variant="header" className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-body-sm font-semibold">Festival progress</span>
            <span className="text-caption text-muted-foreground">
              {formatCountdown(event.endsAt)}
            </span>
          </div>
          <ProgressBar value={event.progressPercent} aria-label="Event progress" />
          <p className="text-caption text-muted-foreground">
            {event.progressPercent}% complete · {event.joined ? "Joined" : "Not joined"}
          </p>
        </GlassPanel>

        <section aria-labelledby="event-rewards-heading" className="space-y-2">
          <h2 id="event-rewards-heading" className="text-body-sm font-semibold">
            Event rewards
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {event.rewards.map((reward) => (
              <GlassPanel
                key={reward.id}
                className="flex min-w-[7.5rem] flex-col items-center gap-2 p-3 text-center"
              >
                <span className="text-2xl" aria-hidden>
                  {reward.iconLabel}
                </span>
                <p className="text-caption font-medium">{reward.label}</p>
                <RewardChip
                  variant={reward.currency === "gems" ? "gem" : "xp"}
                  className="text-caption"
                >
                  {reward.amount}
                </RewardChip>
              </GlassPanel>
            ))}
          </div>
        </section>

        <PrimaryClimbButton asChild>
          <Link href="/learn">Continue festival climb</Link>
        </PrimaryClimbButton>
      </PageContainer>
    </IllustratedScreen>
  );
}
