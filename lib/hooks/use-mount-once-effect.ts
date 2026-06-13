"use client";

import { useEffect, useRef } from "react";

/**
 * Runs an effect once per mount when enabled — avoids Strict Mode double-fire.
 */
export function useMountOnceEffect(
  effect: () => void | (() => void),
  enabled = true,
): void {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!enabled || hasRun.current) return;
    hasRun.current = true;
    return effect();
  }, [effect, enabled]);
}
