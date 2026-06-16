import Link from "next/link";
import type { ReactNode } from "react";
import { RegionHeroImage } from "@/components/media/region-hero-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import {
  GlassPanel,
  IllustratedScreen,
  PrimaryClimbButton,
  RewardChip,
  StoryTitle,
} from "@/components/visual";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import { JOURNEY_WORLD_ASSETS } from "@/lib/assets/art-mappings";
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
    <IllustratedScreen className={cn("min-h-0 rounded-card", className)}>
      <div className="space-y-4 p-4">
        <header className="space-y-3 text-center">
          <WorldArtImage
            asset={JOURNEY_WORLD_ASSETS.region_gate}
            alt=""
            width={120}
            height={80}
            className="mx-auto opacity-90"
          />
          <StoryTitle as="h2">{title}</StoryTitle>
          <p className="text-body-sm text-muted-foreground">
            Shrine cleared — rewards await on the trail ahead.
          </p>
          <YamaPresence
            presence={yamaService.resolveCheckpointPresence(true)}
            size="md"
            layout="vertical"
            className="items-center"
          />
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
                <UiIconImage name="gem" size={16} />
                +{gemsReward}
              </RewardChip>
            ) : null}
            {itemsEarned.map((item) => (
              <span
                key={item.label}
                className="inline-flex flex-col items-center gap-1 rounded-lg border border-white/55 bg-white/48 px-3 py-2 backdrop-blur-sm"
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
