"use client";

import { YamaCelebration } from "@/features/yama/components/yama-celebration";
import { yamaService } from "@/features/yama/services/yama.service";
import type { CollectibleViewModel } from "@/features/collectibles/types/collectible.types";

type CollectibleUnlockFeedbackProps = {
  collectible: CollectibleViewModel | null;
};

export function CollectibleUnlockFeedback({
  collectible,
}: CollectibleUnlockFeedbackProps) {
  if (!collectible) return null;

  return (
    <YamaCelebration
      presence={yamaService.resolveCelebration("achievement")}
      title={`${collectible.name} collected`}
    />
  );
}
