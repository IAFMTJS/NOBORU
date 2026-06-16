"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { LOADING_SYNTHETIC_TICK_MS } from "@/features/yama/constants/loading.constants";
import { loadingService } from "@/features/yama/services/loading.service";
import type {
  LoadingPresentationInput,
  LoadingPresentationViewModel,
} from "@/features/yama/types/loading.types";

type UseLoadingPresentationOptions = Omit<
  LoadingPresentationInput,
  "pathname" | "tick" | "elapsedMs"
> & {
  /** Disable synthetic timeline (e.g. when explicit percent is provided). */
  animate?: boolean;
};

export function useLoadingPresentation(
  options: UseLoadingPresentationOptions = {},
): LoadingPresentationViewModel {
  const pathname = usePathname();
  const {
    animate = true,
    profile,
    title,
    subtitle,
    statusMessage,
    percent,
    mode,
    seed,
  } = options;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!animate || percent !== undefined) return;

    const intervalId = window.setInterval(() => {
      setTick((current) => current + 1);
    }, LOADING_SYNTHETIC_TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [animate, percent]);

  return useMemo(
    () =>
      loadingService.resolvePresentation({
        profile,
        title,
        subtitle,
        statusMessage,
        percent,
        mode,
        seed,
        pathname: pathname ?? undefined,
        tick: animate && percent === undefined ? tick : 0,
        elapsedMs: animate && percent === undefined ? tick * LOADING_SYNTHETIC_TICK_MS : 0,
      }),
    [
      animate,
      mode,
      pathname,
      percent,
      profile,
      seed,
      statusMessage,
      subtitle,
      tick,
      title,
    ],
  );
}
