"use client";

import { useEffect, useState } from "react";

import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { IllustratedScreen, StoryTitle } from "@/components/visual";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import type { ArtAssetRef } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

const LEVEL_MEDALLION: ArtAssetRef = {
  category: "rewards",
  id: "reward-level-medallion-24",
};

type LevelUpCeremonyProps = {
  level: number;
  open: boolean;
  onComplete: () => void;
  className?: string;
};

/** Doc 11 Component 016 — 1200ms level-up celebration sequence. */
export function LevelUpCeremony({
  level,
  open,
  onComplete,
  className,
}: LevelUpCeremonyProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    const revealId = window.setTimeout(() => setVisible(true), 80);
    const completeId = window.setTimeout(() => onComplete(), 1200);
    return () => {
      window.clearTimeout(revealId);
      window.clearTimeout(completeId);
    };
  }, [open, onComplete]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={`Level ${level} reached`}
    >
      <IllustratedScreen
        scrim="minimal"
        className={cn(
          "max-w-xs transition-all duration-[1200ms] motion-reduce:transition-none",
          visible ? "scale-100 opacity-100" : "scale-90 opacity-0",
        )}
      >
        <div className="space-y-4 p-6 text-center">
          <WorldArtImage
            asset={LEVEL_MEDALLION}
            alt=""
            width={96}
            height={96}
            className="mx-auto animate-[journey-node-pulse_1.2s_ease-in-out_infinite] motion-reduce:animate-none"
          />
          <StoryTitle as="h2">Level {level}</StoryTitle>
          <YamaPresence
            presence={yamaService.resolveCelebration("level_up")}
            size="md"
            layout="vertical"
            className="items-center"
          />
        </div>
      </IllustratedScreen>
    </div>
  );
}
