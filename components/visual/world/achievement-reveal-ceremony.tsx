"use client";

import type { AchievementUnlockViewModel } from "@/features/achievements/types/achievement.types";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import { IllustratedScreen, StoryTitle } from "@/components/visual";
import { FX_ASSETS } from "@/lib/assets/lesson-node-assets";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "./world-art-image";

type AchievementRevealCeremonyProps = {
  achievement: AchievementUnlockViewModel;
  open: boolean;
  onDismiss: () => void;
  className?: string;
};

/** Doc 11 — shrine plaque achievement reveal with golden star FX. */
export function AchievementRevealCeremony({
  achievement,
  open,
  onDismiss,
  className,
}: AchievementRevealCeremonyProps) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm",
        className,
      )}
      role="dialog"
      aria-modal
      aria-label={`Achievement unlocked: ${achievement.name}`}
    >
      <IllustratedScreen scrim="full" className="max-w-sm">
        <div className="space-y-4 p-6 text-center">
          <WorldArtImage
            asset={FX_ASSETS.golden_star}
            alt=""
            width={64}
            height={64}
            className="mx-auto motion-reward animate-[journey-node-pulse_1s_ease-in-out_infinite] motion-reduce:animate-none"
          />
          <StoryTitle as="h2">{achievement.name}</StoryTitle>
          <p className="text-body-sm text-muted-foreground">{achievement.description}</p>
          <YamaPresence
            presence={yamaService.resolveCelebration("achievement")}
            size="md"
            layout="vertical"
            className="items-center"
          />
          <button
            type="button"
            onClick={onDismiss}
            className="focus-ring w-full rounded-[var(--radius)] border border-glass-border py-2.5 text-body-sm font-medium"
          >
            Continue
          </button>
        </div>
      </IllustratedScreen>
    </div>
  );
}
