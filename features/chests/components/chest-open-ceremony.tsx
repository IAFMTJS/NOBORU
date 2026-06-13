"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { YamaCelebration } from "@/features/yama/components/yama-celebration";
import { yamaService } from "@/features/yama/services/yama.service";
import type { ChestClaimResult } from "@/features/chests/types/chest.types";

type ChestOpenCeremonyProps = {
  reward: ChestClaimResult;
  onClose: () => void;
};

export function ChestOpenCeremony({ reward, onClose }: ChestOpenCeremonyProps) {
  const [revealed, setRevealed] = useState(0);

  const items = [
    reward.epReward > 0 ? `+${reward.epReward} EP` : null,
    reward.bondXpReward > 0 ? `+${reward.bondXpReward} Bond XP` : null,
    reward.collectibleSlug ? `Collectible unlocked` : null,
    reward.shrineProtectionGrant > 0
      ? `+${reward.shrineProtectionGrant} Shrine Protection`
      : null,
  ].filter(Boolean) as string[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-elevation-2">
        <YamaCelebration
          presence={yamaService.resolveCelebration("quest")}
          title={reward.alreadyClaimed ? "Already opened" : reward.title}
        />
        <div className="space-y-2">
          {items.slice(0, revealed).map((item) => (
            <Badge key={item} variant="secondary" className="mr-2">
              {item}
            </Badge>
          ))}
        </div>
        {revealed < items.length ? (
          <Button className="w-full" onClick={() => setRevealed((v) => v + 1)}>
            Reveal reward {revealed + 1}/{items.length}
          </Button>
        ) : (
          <Button className="w-full" onClick={onClose}>
            Continue climbing
          </Button>
        )}
      </div>
    </div>
  );
}
