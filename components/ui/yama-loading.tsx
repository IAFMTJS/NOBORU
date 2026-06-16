"use client";

import { FullscreenLoadingShell } from "@/components/visual/fullscreen-loading-shell";
import type { LoadingPresentationInput } from "@/features/yama/types/loading.types";

type YamaLoadingProps = LoadingPresentationInput & {
  className?: string;
  animate?: boolean;
};

export function YamaLoading({
  className,
  mode = "compact",
  animate = true,
  ...presentation
}: YamaLoadingProps) {
  return (
    <FullscreenLoadingShell
      className={className}
      mode={mode}
      animate={animate}
      {...presentation}
    />
  );
}
