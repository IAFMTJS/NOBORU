"use client";

import { useLoadingPresentation } from "@/features/yama/hooks/use-loading-presentation";
import type { LoadingPresentationInput } from "@/features/yama/types/loading.types";

import { FullscreenLoadingShell } from "./fullscreen-shell";

type LoadingShellProps = LoadingPresentationInput & {
  className?: string;
  animate?: boolean;
};

/** Visual loading entry — presentation logic stays in yama hook. */
export function LoadingShell({ className, animate = true, ...input }: LoadingShellProps) {
  const presentation = useLoadingPresentation({ ...input, animate });
  return <FullscreenLoadingShell className={className} {...presentation} />;
}

export { FullscreenLoadingShell };
