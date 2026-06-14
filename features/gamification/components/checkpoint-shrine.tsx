import Link from "next/link";
import type { ReactNode } from "react";
import { Gem } from "lucide-react";

import { RegionHeroImage } from "@/components/media/region-hero-image";
import {
  GlassPanel,
  IllustratedScreen,
  PrimaryClimbButton,
  RewardChip,
  StoryTitle,
} from "@/components/visual";
import { cn } from "@/lib/utils";

export type CheckpointRewardItem = {
  label: string;
  icon: string;
  quantity?: number;
};

export type CheckpointShrineProps = {
  title?: string;
  xpReward: number;
  gemsReward?: number;
  itemsEarned?: CheckpointRewardItem[];
  regionUnlock?: { name: string; slug: string } | null;
  continueHref: string;
  continueLabel?: string;
  className?: string;
  footerSlot?: ReactNode;
};

export function CheckpointShrine({
  title = "Checkpoint Reached",
  xpReward,
  gemsReward = 0,
  itemsEarned = [],
  regionUnlock = null,
  continueHref,
  continueLabel = "Continue Climbing",
  className,
  footerSlot,
}: CheckpointShrineProps) {
  return (
    <IllustratedScreen
      className={cn("min-h-0 rounded-card", className)}
      scrim="full"
      background={
        <>
          <RegionHeroImage
            regionSlug="forest-trail"
            alt=""
            className="absolute inset-0 h-full min-h-[28rem] rounded-none"
            hideOverlay
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background/95" />
        </>
      }
    >
      <div className="space-y-4 p-4">
        <header className="space-y-1 text-center">
          <StoryTitle as="h2">{title}</StoryTitle>
          <p className="text-body-sm text-muted-foreground">
            Shrine cleared — rewards await on the trail ahead.
          </p>
        </header>

        <GlassPanel className="space-y-4 p-4">
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Rewards
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <RewardChip variant="xp" className="px-3 py-1 text-base">
              +{xpReward} XP
            </RewardChip>
            {gemsReward > 0 ? (
              <RewardChip variant="gem" className="px-3 py-1 text-base">
                <Gem className="h-4 w-4" aria-hidden />
                +{gemsReward}
              </RewardChip>
            ) : null}
            {itemsEarned.map((item) => (
              <span
                key={item.label}
                className="inline-flex flex-col items-center gap-1 rounded-lg border border-glass-border bg-background/40 px-3 py-2"
              >
                <span className="text-2xl" aria-hidden>
                  {item.icon}
                </span>
                <span className="text-caption font-medium">{item.label}</span>
                {item.quantity ? (
                  <span className="text-caption text-muted-foreground">
                    ×{item.quantity}
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </GlassPanel>

        {regionUnlock ? (
          <GlassPanel className="flex items-center gap-3 p-3">
            <RegionHeroImage
              regionSlug={regionUnlock.slug}
              alt={regionUnlock.name}
              size="thumbnail"
            />
            <div className="min-w-0 space-y-0.5">
              <p className="text-caption text-muted-foreground">New region unlocked</p>
              <p className="text-body-sm font-medium">{regionUnlock.name}</p>
            </div>
          </GlassPanel>
        ) : null}

        {footerSlot}

        <PrimaryClimbButton asChild>
          <Link href={continueHref}>{continueLabel}</Link>
        </PrimaryClimbButton>
      </div>
    </IllustratedScreen>
  );
}
