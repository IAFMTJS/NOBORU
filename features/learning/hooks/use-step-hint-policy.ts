"use client";

import { useState } from "react";

import type { PedagogyStepMeta } from "@/features/learning/types/lesson.types";
import { shouldRevealRomaji } from "@/lib/learning/hint-policy.service";

export function useStepHintPolicy(step: PedagogyStepMeta) {
  const [romajiRevealed, setRomajiRevealed] = useState(false);
  const policy = step.hintPolicy;

  const showRomaji = policy
    ? shouldRevealRomaji(policy, romajiRevealed, false)
    : true;
  const showTranslation = policy?.showTranslation ?? true;
  const showFurigana = policy?.showFurigana ?? true;
  const canRevealRomaji = policy?.romajiOnDemand ?? false;

  return {
    showRomaji,
    showTranslation,
    showFurigana,
    canRevealRomaji,
    romajiRevealed,
    revealRomaji: () => setRomajiRevealed(true),
  };
}
