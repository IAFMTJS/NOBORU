"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AchievementRevealCeremony } from "@/components/visual/world/achievement-reveal-ceremony";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { StoryTitle } from "@/components/visual";
import { CAMP_WORLD_ASSETS } from "@/lib/assets/art-mappings";
import type { ChestClaimResult } from "@/features/chests/types/chest.types";
import { cn } from "@/lib/utils";

type ChestOpenCeremonyProps = {
  reward: ChestClaimResult;
  onClose: () => void;
};

type RewardLine = {
  key: string;
  label: string;
  asset: (typeof CAMP_WORLD_ASSETS)[keyof typeof CAMP_WORLD_ASSETS];
};

function buildRewardLines(reward: ChestClaimResult): RewardLine[] {
  const lines: RewardLine[] = [];

  if (reward.epReward > 0) {
    lines.push({
      key: "ep",
      label: `+${reward.epReward} EP`,
      asset: CAMP_WORLD_ASSETS.chest_available,
    });
  }
  if (reward.bondXpReward > 0) {
    lines.push({
      key: "bond",
      label: `+${reward.bondXpReward} Bond XP`,
      asset: CAMP_WORLD_ASSETS.chest_collected,
    });
  }
  if (reward.collectibleSlug) {
    lines.push({
      key: "collectible",
      label: "Collectible unlocked",
      asset: CAMP_WORLD_ASSETS.chest_collected,
    });
  }
  if (reward.shrineProtectionGrant > 0) {
    lines.push({
      key: "protection",
      label: `+${reward.shrineProtectionGrant} Shrine Protection`,
      asset: CAMP_WORLD_ASSETS.shrine_lantern,
    });
  }

  return lines;
}

export function ChestOpenCeremony({ reward, onClose }: ChestOpenCeremonyProps) {
  const [revealed, setRevealed] = useState(0);
  const [achievementIndex, setAchievementIndex] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);

  const items = buildRewardLines(reward);
  const allRevealed = revealed >= items.length;
  const achievements = reward.unlockedAchievements ?? [];
  const chestAsset = allRevealed
    ? CAMP_WORLD_ASSETS.chest_collected
    : revealed > 0
      ? CAMP_WORLD_ASSETS.chest_opening
      : CAMP_WORLD_ASSETS.chest_available;

  function handleChestComplete() {
    if (achievements.length > 0) {
      setShowAchievements(true);
      return;
    }
    onClose();
  }

  function handleAchievementDismiss() {
    if (achievementIndex < achievements.length - 1) {
      setAchievementIndex((value) => value + 1);
      return;
    }
    onClose();
  }

  if (showAchievements && achievements[achievementIndex]) {
    return (
      <AchievementRevealCeremony
        achievement={achievements[achievementIndex]}
        open
        onDismiss={handleAchievementDismiss}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="motion-reward w-full max-w-sm space-y-5 rounded-2xl border border-white/10 bg-black/60 p-6 shadow-elevation-2 backdrop-blur-md">
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className={cn(
              "relative drop-shadow-[0_12px_32px_rgba(251,191,36,0.35)]",
              !allRevealed && "trail-glow-warm",
            )}
          >
            <WorldArtImage
              asset={chestAsset}
              alt=""
              width={96}
              height={96}
              className={cn(
                "motion-reward h-24 w-24 object-contain",
                !allRevealed &&
                  revealed === 0 &&
                  "animate-[journey-node-pulse_2s_ease-in-out_infinite] motion-reduce:animate-none",
              )}
            />
          </div>
          <StoryTitle as="h2" className="text-base text-amber-50">
            {reward.alreadyClaimed ? "Already opened" : reward.title}
          </StoryTitle>
        </div>

        <div className="space-y-2">
          {items.slice(0, revealed).map((item) => (
            <div
              key={item.key}
              className="motion-reward flex items-center gap-3 rounded-lg border border-amber-900/40 bg-amber-950/40 px-3 py-2 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
            >
              <WorldArtImage
                asset={item.asset}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 object-contain"
              />
              <span className="text-body-sm font-medium text-amber-50/95">{item.label}</span>
            </div>
          ))}
        </div>

        {!allRevealed ? (
          <Button className="w-full" onClick={() => setRevealed((value) => value + 1)}>
            Reveal reward {revealed + 1}/{items.length}
          </Button>
        ) : (
          <Button className="w-full" onClick={handleChestComplete}>
            Continue climbing
          </Button>
        )}
      </div>
    </div>
  );
}
