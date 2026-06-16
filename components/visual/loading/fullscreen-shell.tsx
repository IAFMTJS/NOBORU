"use client";

import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import type { LoadingPresentationViewModel } from "@/features/yama/types/loading.types";
import { cn } from "@/lib/utils";

type FullscreenLoadingShellProps = LoadingPresentationViewModel & {
  className?: string;
};

/** Basic loading shell — no scene art or mascot. */
export function FullscreenLoadingShell({
  className,
  ...presentation
}: FullscreenLoadingShellProps) {
  const isFullscreen = presentation.mode === "fullscreen";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={presentation.title}
      className={cn(
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col bg-background"
          : "relative flex min-h-[50dvh] flex-col rounded-lg border border-border",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center",
          isFullscreen && "pb-safe-bottom",
        )}
      >
        <h1 className="text-lg font-semibold">{presentation.title}</h1>
        <p className="text-body-sm text-muted-foreground">{presentation.subtitle}</p>
        <p className="text-body-sm text-muted-foreground">{presentation.statusMessage}</p>

        {presentation.showSpinner ? (
          <Spinner size="sm" />
        ) : (
          <div className="w-full max-w-xs space-y-2">
            <Progress value={presentation.percent} className="h-2" />
            <p className="text-caption text-muted-foreground">{presentation.percent}%</p>
          </div>
        )}

        <p className="text-caption uppercase tracking-wide text-muted-foreground">
          {presentation.stageLabel}
        </p>
      </div>
    </div>
  );
}
